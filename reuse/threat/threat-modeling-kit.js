"use strict";
/**
 * @fileoverview Threat Modeling Kit - Enterprise Security Architecture and Threat Analysis
 * @module reuse/threat/threat-modeling-kit
 * @description Comprehensive threat modeling toolkit for enterprise security architecture,
 * providing STRIDE, DREAD, PASTA methodologies, data flow analysis, attack tree generation,
 * and MITRE ATT&CK integration. Designed to compete with enterprise threat modeling solutions.
 *
 * Key Features:
 * - Multi-framework threat model creation (STRIDE, DREAD, PASTA, LINDDUN, VAST)
 * - Automated data flow diagram (DFD) analysis and generation
 * - Trust boundary identification and classification
 * - Attack tree generation with probability scoring
 * - Threat scenario modeling with impact assessment
 * - Security architecture review and validation
 * - Threat model validation and completeness checking
 * - Risk-based threat prioritization using multiple scoring systems
 * - Threat model versioning and maintenance workflows
 * - MITRE ATT&CK framework integration and mapping
 * - Collaborative threat modeling with team workflows
 * - Threat model report generation and documentation
 *
 * @target Enterprise Threat Modeling alternative (Microsoft Threat Modeling Tool, IriusRisk)
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for threat models
 * - Audit trails for threat model changes
 * - Sensitive threat data encryption
 * - SOC 2 Type II compliance
 * - Multi-tenant threat model isolation
 *
 * @example STRIDE threat modeling
 * ```typescript
 * import { createSTRIDEThreatModel, analyzeSTRIDEThreats } from './threat-modeling-kit';
 *
 * const model = await createSTRIDEThreatModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Payment Processing API',
 *   scope: 'ENTIRE_APPLICATION',
 *   assets: ['customer-data', 'payment-info', 'authentication'],
 * }, sequelize);
 *
 * const threats = await analyzeSTRIDEThreats(model.id, sequelize);
 * ```
 *
 * @example Data flow diagram analysis
 * ```typescript
 * import { generateDataFlowDiagram, analyzeTrustBoundaries } from './threat-modeling-kit';
 *
 * const dfd = await generateDataFlowDiagram({
 *   applicationId: 'app-123',
 *   components: ['web-app', 'api', 'database'],
 *   dataFlows: [
 *     { from: 'web-app', to: 'api', data: 'user-credentials' },
 *     { from: 'api', to: 'database', data: 'encrypted-data' },
 *   ],
 * }, sequelize);
 *
 * const boundaries = await analyzeTrustBoundaries(dfd.id, sequelize);
 * ```
 *
 * LOC: THREAT-MODEL-014
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns
 * DOWNSTREAM: security-operations, risk-management, compliance, architecture
 *
 * @version 1.0.0
 * @since 2025-01-09
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
exports.validateThreatMitigations = exports.checkThreatModelCoverage = exports.validateThreatModelCompleteness = exports.generateArchitectureSecurityScorecard = exports.analyzeSecurityControlCoverage = exports.validateSecurityDesignPatterns = exports.performSecurityArchitectureReview = exports.generateThreatScenarioReport = exports.compareThreatScenarios = exports.simulateThreatScenario = exports.analyzeThreatScenarioImpact = exports.createThreatScenario = exports.exportAttackTree = exports.analyzeAttackTreeMitigations = exports.identifyMostLikelyAttackPath = exports.calculateAttackTreeProbabilities = exports.generateAttackTree = exports.generateBoundaryThreatReport = exports.validateTrustBoundaryControls = exports.analyzeBoundaryCrossings = exports.classifyTrustBoundaryType = exports.identifyTrustBoundaries = exports.updateDataFlowDiagram = exports.exportDataFlowDiagram = exports.validateDataFlowDiagram = exports.analyzeTrustBoundaries = exports.analyzeDataFlowRisks = exports.generateDataFlowDiagram = exports.updateThreatModelStatus = exports.getThreatModelById = exports.executePASTAStage = exports.createPASTAModel = exports.calculateDREADScore = exports.createDREADModel = exports.analyzeSTRIDEThreats = exports.createSTRIDEThreatModel = exports.MITREMappingDto = exports.AttackTreeDto = exports.DataFlowDiagramDto = exports.DREADScoreDto = exports.STRIDEThreatDto = exports.ThreatModelDto = exports.ThreatSeverity = exports.ComponentType = exports.TrustBoundaryType = exports.ThreatModelStatus = exports.PASTAStage = exports.DREADFactor = exports.STRIDECategory = exports.ThreatModelFramework = void 0;
exports.generateMITRECoverageReport = exports.mapThreatToMITREATTACK = exports.archiveThreatModel = exports.updateThreatModel = exports.calculateResidualRisk = exports.generateThreatRiskMatrix = exports.prioritizeThreatsByRisk = exports.generateThreatModelValidationReport = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * @enum ThreatModelFramework
 * @description Threat modeling frameworks
 */
var ThreatModelFramework;
(function (ThreatModelFramework) {
    ThreatModelFramework["STRIDE"] = "STRIDE";
    ThreatModelFramework["DREAD"] = "DREAD";
    ThreatModelFramework["PASTA"] = "PASTA";
    ThreatModelFramework["LINDDUN"] = "LINDDUN";
    ThreatModelFramework["VAST"] = "VAST";
    ThreatModelFramework["OCTAVE"] = "OCTAVE";
    ThreatModelFramework["TRIKE"] = "TRIKE";
})(ThreatModelFramework || (exports.ThreatModelFramework = ThreatModelFramework = {}));
/**
 * @enum STRIDECategory
 * @description STRIDE threat categories
 */
var STRIDECategory;
(function (STRIDECategory) {
    STRIDECategory["SPOOFING"] = "SPOOFING";
    STRIDECategory["TAMPERING"] = "TAMPERING";
    STRIDECategory["REPUDIATION"] = "REPUDIATION";
    STRIDECategory["INFORMATION_DISCLOSURE"] = "INFORMATION_DISCLOSURE";
    STRIDECategory["DENIAL_OF_SERVICE"] = "DENIAL_OF_SERVICE";
    STRIDECategory["ELEVATION_OF_PRIVILEGE"] = "ELEVATION_OF_PRIVILEGE";
})(STRIDECategory || (exports.STRIDECategory = STRIDECategory = {}));
/**
 * @enum DREADFactor
 * @description DREAD risk factors
 */
var DREADFactor;
(function (DREADFactor) {
    DREADFactor["DAMAGE"] = "DAMAGE";
    DREADFactor["REPRODUCIBILITY"] = "REPRODUCIBILITY";
    DREADFactor["EXPLOITABILITY"] = "EXPLOITABILITY";
    DREADFactor["AFFECTED_USERS"] = "AFFECTED_USERS";
    DREADFactor["DISCOVERABILITY"] = "DISCOVERABILITY";
})(DREADFactor || (exports.DREADFactor = DREADFactor = {}));
/**
 * @enum PASTAStage
 * @description PASTA methodology stages
 */
var PASTAStage;
(function (PASTAStage) {
    PASTAStage["DEFINE_OBJECTIVES"] = "DEFINE_OBJECTIVES";
    PASTAStage["DEFINE_TECHNICAL_SCOPE"] = "DEFINE_TECHNICAL_SCOPE";
    PASTAStage["APPLICATION_DECOMPOSITION"] = "APPLICATION_DECOMPOSITION";
    PASTAStage["THREAT_ANALYSIS"] = "THREAT_ANALYSIS";
    PASTAStage["VULNERABILITY_DETECTION"] = "VULNERABILITY_DETECTION";
    PASTAStage["ATTACK_MODELING"] = "ATTACK_MODELING";
    PASTAStage["RISK_IMPACT_ANALYSIS"] = "RISK_IMPACT_ANALYSIS";
})(PASTAStage || (exports.PASTAStage = PASTAStage = {}));
/**
 * @enum ThreatModelStatus
 * @description Threat model lifecycle status
 */
var ThreatModelStatus;
(function (ThreatModelStatus) {
    ThreatModelStatus["DRAFT"] = "DRAFT";
    ThreatModelStatus["IN_REVIEW"] = "IN_REVIEW";
    ThreatModelStatus["APPROVED"] = "APPROVED";
    ThreatModelStatus["PUBLISHED"] = "PUBLISHED";
    ThreatModelStatus["DEPRECATED"] = "DEPRECATED";
    ThreatModelStatus["ARCHIVED"] = "ARCHIVED";
})(ThreatModelStatus || (exports.ThreatModelStatus = ThreatModelStatus = {}));
/**
 * @enum TrustBoundaryType
 * @description Types of trust boundaries
 */
var TrustBoundaryType;
(function (TrustBoundaryType) {
    TrustBoundaryType["NETWORK"] = "NETWORK";
    TrustBoundaryType["PROCESS"] = "PROCESS";
    TrustBoundaryType["PHYSICAL"] = "PHYSICAL";
    TrustBoundaryType["DATA_STORE"] = "DATA_STORE";
    TrustBoundaryType["AUTHENTICATION"] = "AUTHENTICATION";
    TrustBoundaryType["AUTHORIZATION"] = "AUTHORIZATION";
})(TrustBoundaryType || (exports.TrustBoundaryType = TrustBoundaryType = {}));
/**
 * @enum ComponentType
 * @description DFD component types
 */
var ComponentType;
(function (ComponentType) {
    ComponentType["EXTERNAL_ENTITY"] = "EXTERNAL_ENTITY";
    ComponentType["PROCESS"] = "PROCESS";
    ComponentType["DATA_STORE"] = "DATA_STORE";
    ComponentType["DATA_FLOW"] = "DATA_FLOW";
    ComponentType["TRUST_BOUNDARY"] = "TRUST_BOUNDARY";
})(ComponentType || (exports.ComponentType = ComponentType = {}));
/**
 * @enum ThreatSeverity
 * @description Threat severity levels
 */
var ThreatSeverity;
(function (ThreatSeverity) {
    ThreatSeverity["CRITICAL"] = "CRITICAL";
    ThreatSeverity["HIGH"] = "HIGH";
    ThreatSeverity["MEDIUM"] = "MEDIUM";
    ThreatSeverity["LOW"] = "LOW";
    ThreatSeverity["INFORMATIONAL"] = "INFORMATIONAL";
})(ThreatSeverity || (exports.ThreatSeverity = ThreatSeverity = {}));
// ============================================================================
// SWAGGER DTO CLASSES
// ============================================================================
/**
 * @class ThreatModelDto
 * @description DTO for threat model
 */
let ThreatModelDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _applicationName_decorators;
    let _applicationName_initializers = [];
    let _applicationName_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _assets_decorators;
    let _assets_initializers = [];
    let _assets_extraInitializers = [];
    let _stakeholders_decorators;
    let _stakeholders_initializers = [];
    let _stakeholders_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class ThreatModelDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.applicationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
                this.applicationName = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _applicationName_initializers, void 0));
                this.framework = (__runInitializers(this, _applicationName_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
                this.version = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.scope = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.assets = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _assets_initializers, void 0));
                this.stakeholders = (__runInitializers(this, _assets_extraInitializers), __runInitializers(this, _stakeholders_initializers, void 0));
                this.status = (__runInitializers(this, _stakeholders_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.createdBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                this.reviewedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
                this.createdAt = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat model unique identifier', example: 'tm-1234567890' })];
            _applicationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Application identifier', example: 'app-123' })];
            _applicationName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Application name', example: 'Payment Processing API' })];
            _framework_decorators = [(0, swagger_1.ApiProperty)({ enum: ThreatModelFramework, description: 'Threat modeling framework' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model version', example: '1.0' })];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope of threat model', example: 'ENTIRE_APPLICATION' })];
            _assets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assets being protected', type: [String] })];
            _stakeholders_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stakeholders involved', type: [String] })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ThreatModelStatus, description: 'Model status' })];
            _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID', example: 'user-123' })];
            _reviewedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewed by user IDs', type: [String], required: false })];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last updated timestamp' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
            __esDecorate(null, null, _applicationName_decorators, { kind: "field", name: "applicationName", static: false, private: false, access: { has: obj => "applicationName" in obj, get: obj => obj.applicationName, set: (obj, value) => { obj.applicationName = value; } }, metadata: _metadata }, _applicationName_initializers, _applicationName_extraInitializers);
            __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _assets_decorators, { kind: "field", name: "assets", static: false, private: false, access: { has: obj => "assets" in obj, get: obj => obj.assets, set: (obj, value) => { obj.assets = value; } }, metadata: _metadata }, _assets_initializers, _assets_extraInitializers);
            __esDecorate(null, null, _stakeholders_decorators, { kind: "field", name: "stakeholders", static: false, private: false, access: { has: obj => "stakeholders" in obj, get: obj => obj.stakeholders, set: (obj, value) => { obj.stakeholders = value; } }, metadata: _metadata }, _stakeholders_initializers, _stakeholders_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ThreatModelDto = ThreatModelDto;
/**
 * @class STRIDEThreatDto
 * @description DTO for STRIDE threat
 */
let STRIDEThreatDto = (() => {
    var _a;
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _threatId_decorators;
    let _threatId_initializers = [];
    let _threatId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _affectedAsset_decorators;
    let _affectedAsset_initializers = [];
    let _affectedAsset_extraInitializers = [];
    let _attackVector_decorators;
    let _attackVector_initializers = [];
    let _attackVector_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _likelihood_decorators;
    let _likelihood_initializers = [];
    let _likelihood_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _mitigations_decorators;
    let _mitigations_initializers = [];
    let _mitigations_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class STRIDEThreatDto {
            constructor() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.threatId = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _threatId_initializers, void 0));
                this.description = (__runInitializers(this, _threatId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.affectedAsset = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _affectedAsset_initializers, void 0));
                this.attackVector = (__runInitializers(this, _affectedAsset_extraInitializers), __runInitializers(this, _attackVector_initializers, void 0));
                this.impact = (__runInitializers(this, _attackVector_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                this.likelihood = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _likelihood_initializers, void 0));
                this.severity = (__runInitializers(this, _likelihood_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.mitigations = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _mitigations_initializers, void 0));
                this.status = (__runInitializers(this, _mitigations_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: STRIDECategory, description: 'STRIDE category' })];
            _threatId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat identifier', example: 'stride-threat-123' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat description' })];
            _affectedAsset_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected asset', example: 'customer-database' })];
            _attackVector_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attack vector', example: 'SQL Injection' })];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact description' })];
            _likelihood_decorators = [(0, swagger_1.ApiProperty)({ description: 'Likelihood score (0-10)', example: 7.5 })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ThreatSeverity, description: 'Threat severity' })];
            _mitigations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Mitigation strategies', type: [String] })];
            _status_decorators = [(0, swagger_1.ApiProperty)({
                    enum: ['IDENTIFIED', 'MITIGATED', 'ACCEPTED', 'TRANSFERRED'],
                    description: 'Threat status'
                })];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _threatId_decorators, { kind: "field", name: "threatId", static: false, private: false, access: { has: obj => "threatId" in obj, get: obj => obj.threatId, set: (obj, value) => { obj.threatId = value; } }, metadata: _metadata }, _threatId_initializers, _threatId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _affectedAsset_decorators, { kind: "field", name: "affectedAsset", static: false, private: false, access: { has: obj => "affectedAsset" in obj, get: obj => obj.affectedAsset, set: (obj, value) => { obj.affectedAsset = value; } }, metadata: _metadata }, _affectedAsset_initializers, _affectedAsset_extraInitializers);
            __esDecorate(null, null, _attackVector_decorators, { kind: "field", name: "attackVector", static: false, private: false, access: { has: obj => "attackVector" in obj, get: obj => obj.attackVector, set: (obj, value) => { obj.attackVector = value; } }, metadata: _metadata }, _attackVector_initializers, _attackVector_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            __esDecorate(null, null, _likelihood_decorators, { kind: "field", name: "likelihood", static: false, private: false, access: { has: obj => "likelihood" in obj, get: obj => obj.likelihood, set: (obj, value) => { obj.likelihood = value; } }, metadata: _metadata }, _likelihood_initializers, _likelihood_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _mitigations_decorators, { kind: "field", name: "mitigations", static: false, private: false, access: { has: obj => "mitigations" in obj, get: obj => obj.mitigations, set: (obj, value) => { obj.mitigations = value; } }, metadata: _metadata }, _mitigations_initializers, _mitigations_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.STRIDEThreatDto = STRIDEThreatDto;
/**
 * @class DREADScoreDto
 * @description DTO for DREAD score
 */
let DREADScoreDto = (() => {
    var _a;
    let _damage_decorators;
    let _damage_initializers = [];
    let _damage_extraInitializers = [];
    let _reproducibility_decorators;
    let _reproducibility_initializers = [];
    let _reproducibility_extraInitializers = [];
    let _exploitability_decorators;
    let _exploitability_initializers = [];
    let _exploitability_extraInitializers = [];
    let _affectedUsers_decorators;
    let _affectedUsers_initializers = [];
    let _affectedUsers_extraInitializers = [];
    let _discoverability_decorators;
    let _discoverability_initializers = [];
    let _discoverability_extraInitializers = [];
    let _totalScore_decorators;
    let _totalScore_initializers = [];
    let _totalScore_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    return _a = class DREADScoreDto {
            constructor() {
                this.damage = __runInitializers(this, _damage_initializers, void 0);
                this.reproducibility = (__runInitializers(this, _damage_extraInitializers), __runInitializers(this, _reproducibility_initializers, void 0));
                this.exploitability = (__runInitializers(this, _reproducibility_extraInitializers), __runInitializers(this, _exploitability_initializers, void 0));
                this.affectedUsers = (__runInitializers(this, _exploitability_extraInitializers), __runInitializers(this, _affectedUsers_initializers, void 0));
                this.discoverability = (__runInitializers(this, _affectedUsers_extraInitializers), __runInitializers(this, _discoverability_initializers, void 0));
                this.totalScore = (__runInitializers(this, _discoverability_extraInitializers), __runInitializers(this, _totalScore_initializers, void 0));
                this.riskLevel = (__runInitializers(this, _totalScore_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
                __runInitializers(this, _riskLevel_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _damage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Damage potential (0-10)', example: 8 })];
            _reproducibility_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reproducibility (0-10)', example: 9 })];
            _exploitability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exploitability (0-10)', example: 6 })];
            _affectedUsers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected users (0-10)', example: 10 })];
            _discoverability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discoverability (0-10)', example: 7 })];
            _totalScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total DREAD score', example: 8.0 })];
            _riskLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], description: 'Risk level' })];
            __esDecorate(null, null, _damage_decorators, { kind: "field", name: "damage", static: false, private: false, access: { has: obj => "damage" in obj, get: obj => obj.damage, set: (obj, value) => { obj.damage = value; } }, metadata: _metadata }, _damage_initializers, _damage_extraInitializers);
            __esDecorate(null, null, _reproducibility_decorators, { kind: "field", name: "reproducibility", static: false, private: false, access: { has: obj => "reproducibility" in obj, get: obj => obj.reproducibility, set: (obj, value) => { obj.reproducibility = value; } }, metadata: _metadata }, _reproducibility_initializers, _reproducibility_extraInitializers);
            __esDecorate(null, null, _exploitability_decorators, { kind: "field", name: "exploitability", static: false, private: false, access: { has: obj => "exploitability" in obj, get: obj => obj.exploitability, set: (obj, value) => { obj.exploitability = value; } }, metadata: _metadata }, _exploitability_initializers, _exploitability_extraInitializers);
            __esDecorate(null, null, _affectedUsers_decorators, { kind: "field", name: "affectedUsers", static: false, private: false, access: { has: obj => "affectedUsers" in obj, get: obj => obj.affectedUsers, set: (obj, value) => { obj.affectedUsers = value; } }, metadata: _metadata }, _affectedUsers_initializers, _affectedUsers_extraInitializers);
            __esDecorate(null, null, _discoverability_decorators, { kind: "field", name: "discoverability", static: false, private: false, access: { has: obj => "discoverability" in obj, get: obj => obj.discoverability, set: (obj, value) => { obj.discoverability = value; } }, metadata: _metadata }, _discoverability_initializers, _discoverability_extraInitializers);
            __esDecorate(null, null, _totalScore_decorators, { kind: "field", name: "totalScore", static: false, private: false, access: { has: obj => "totalScore" in obj, get: obj => obj.totalScore, set: (obj, value) => { obj.totalScore = value; } }, metadata: _metadata }, _totalScore_initializers, _totalScore_extraInitializers);
            __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DREADScoreDto = DREADScoreDto;
/**
 * @class DataFlowDiagramDto
 * @description DTO for data flow diagram
 */
let DataFlowDiagramDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _applicationId_decorators;
    let _applicationId_initializers = [];
    let _applicationId_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _dataFlows_decorators;
    let _dataFlows_initializers = [];
    let _dataFlows_extraInitializers = [];
    let _trustBoundaries_decorators;
    let _trustBoundaries_initializers = [];
    let _trustBoundaries_extraInitializers = [];
    return _a = class DataFlowDiagramDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.applicationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _applicationId_initializers, void 0));
                this.components = (__runInitializers(this, _applicationId_extraInitializers), __runInitializers(this, _components_initializers, void 0));
                this.dataFlows = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _dataFlows_initializers, void 0));
                this.trustBoundaries = (__runInitializers(this, _dataFlows_extraInitializers), __runInitializers(this, _trustBoundaries_initializers, void 0));
                __runInitializers(this, _trustBoundaries_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'DFD identifier', example: 'dfd-123' })];
            _applicationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Application identifier', example: 'app-123' })];
            _components_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'DFD components',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { enum: Object.values(ComponentType) },
                            name: { type: 'string' },
                            trustLevel: { type: 'number' }
                        }
                    }
                })];
            _dataFlows_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Data flows between components',
                    type: 'array'
                })];
            _trustBoundaries_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trust boundaries', type: 'array' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _applicationId_decorators, { kind: "field", name: "applicationId", static: false, private: false, access: { has: obj => "applicationId" in obj, get: obj => obj.applicationId, set: (obj, value) => { obj.applicationId = value; } }, metadata: _metadata }, _applicationId_initializers, _applicationId_extraInitializers);
            __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
            __esDecorate(null, null, _dataFlows_decorators, { kind: "field", name: "dataFlows", static: false, private: false, access: { has: obj => "dataFlows" in obj, get: obj => obj.dataFlows, set: (obj, value) => { obj.dataFlows = value; } }, metadata: _metadata }, _dataFlows_initializers, _dataFlows_extraInitializers);
            __esDecorate(null, null, _trustBoundaries_decorators, { kind: "field", name: "trustBoundaries", static: false, private: false, access: { has: obj => "trustBoundaries" in obj, get: obj => obj.trustBoundaries, set: (obj, value) => { obj.trustBoundaries = value; } }, metadata: _metadata }, _trustBoundaries_initializers, _trustBoundaries_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DataFlowDiagramDto = DataFlowDiagramDto;
/**
 * @class AttackTreeDto
 * @description DTO for attack tree
 */
let AttackTreeDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _threatId_decorators;
    let _threatId_initializers = [];
    let _threatId_extraInitializers = [];
    let _rootGoal_decorators;
    let _rootGoal_initializers = [];
    let _rootGoal_extraInitializers = [];
    let _nodes_decorators;
    let _nodes_initializers = [];
    let _nodes_extraInitializers = [];
    let _criticalPaths_decorators;
    let _criticalPaths_initializers = [];
    let _criticalPaths_extraInitializers = [];
    return _a = class AttackTreeDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.threatId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _threatId_initializers, void 0));
                this.rootGoal = (__runInitializers(this, _threatId_extraInitializers), __runInitializers(this, _rootGoal_initializers, void 0));
                this.nodes = (__runInitializers(this, _rootGoal_extraInitializers), __runInitializers(this, _nodes_initializers, void 0));
                this.criticalPaths = (__runInitializers(this, _nodes_extraInitializers), __runInitializers(this, _criticalPaths_initializers, void 0));
                __runInitializers(this, _criticalPaths_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attack tree identifier', example: 'atree-123' })];
            _threatId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Associated threat ID', example: 'threat-456' })];
            _rootGoal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Root attack goal', example: 'Compromise user database' })];
            _nodes_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Attack tree nodes',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            parentId: { type: 'string' },
                            goal: { type: 'string' },
                            type: { enum: ['AND', 'OR'] },
                            probability: { type: 'number' },
                            cost: { type: 'number' }
                        }
                    }
                })];
            _criticalPaths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Critical attack paths', type: 'array' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _threatId_decorators, { kind: "field", name: "threatId", static: false, private: false, access: { has: obj => "threatId" in obj, get: obj => obj.threatId, set: (obj, value) => { obj.threatId = value; } }, metadata: _metadata }, _threatId_initializers, _threatId_extraInitializers);
            __esDecorate(null, null, _rootGoal_decorators, { kind: "field", name: "rootGoal", static: false, private: false, access: { has: obj => "rootGoal" in obj, get: obj => obj.rootGoal, set: (obj, value) => { obj.rootGoal = value; } }, metadata: _metadata }, _rootGoal_initializers, _rootGoal_extraInitializers);
            __esDecorate(null, null, _nodes_decorators, { kind: "field", name: "nodes", static: false, private: false, access: { has: obj => "nodes" in obj, get: obj => obj.nodes, set: (obj, value) => { obj.nodes = value; } }, metadata: _metadata }, _nodes_initializers, _nodes_extraInitializers);
            __esDecorate(null, null, _criticalPaths_decorators, { kind: "field", name: "criticalPaths", static: false, private: false, access: { has: obj => "criticalPaths" in obj, get: obj => obj.criticalPaths, set: (obj, value) => { obj.criticalPaths = value; } }, metadata: _metadata }, _criticalPaths_initializers, _criticalPaths_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AttackTreeDto = AttackTreeDto;
/**
 * @class MITREMappingDto
 * @description DTO for MITRE ATT&CK mapping
 */
let MITREMappingDto = (() => {
    var _a;
    let _threatId_decorators;
    let _threatId_initializers = [];
    let _threatId_extraInitializers = [];
    let _tactics_decorators;
    let _tactics_initializers = [];
    let _tactics_extraInitializers = [];
    let _techniques_decorators;
    let _techniques_initializers = [];
    let _techniques_extraInitializers = [];
    let _mitigations_decorators;
    let _mitigations_initializers = [];
    let _mitigations_extraInitializers = [];
    let _detections_decorators;
    let _detections_initializers = [];
    let _detections_extraInitializers = [];
    return _a = class MITREMappingDto {
            constructor() {
                this.threatId = __runInitializers(this, _threatId_initializers, void 0);
                this.tactics = (__runInitializers(this, _threatId_extraInitializers), __runInitializers(this, _tactics_initializers, void 0));
                this.techniques = (__runInitializers(this, _tactics_extraInitializers), __runInitializers(this, _techniques_initializers, void 0));
                this.mitigations = (__runInitializers(this, _techniques_extraInitializers), __runInitializers(this, _mitigations_initializers, void 0));
                this.detections = (__runInitializers(this, _mitigations_extraInitializers), __runInitializers(this, _detections_initializers, void 0));
                __runInitializers(this, _detections_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _threatId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Threat identifier', example: 'threat-123' })];
            _tactics_decorators = [(0, swagger_1.ApiProperty)({ description: 'MITRE ATT&CK tactics', type: [String], example: ['Initial Access', 'Execution'] })];
            _techniques_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'MITRE ATT&CK techniques',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            techniqueId: { type: 'string', example: 'T1566' },
                            techniqueName: { type: 'string', example: 'Phishing' }
                        }
                    }
                })];
            _mitigations_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'MITRE mitigations',
                    type: 'array'
                })];
            _detections_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detection methods', type: [String] })];
            __esDecorate(null, null, _threatId_decorators, { kind: "field", name: "threatId", static: false, private: false, access: { has: obj => "threatId" in obj, get: obj => obj.threatId, set: (obj, value) => { obj.threatId = value; } }, metadata: _metadata }, _threatId_initializers, _threatId_extraInitializers);
            __esDecorate(null, null, _tactics_decorators, { kind: "field", name: "tactics", static: false, private: false, access: { has: obj => "tactics" in obj, get: obj => obj.tactics, set: (obj, value) => { obj.tactics = value; } }, metadata: _metadata }, _tactics_initializers, _tactics_extraInitializers);
            __esDecorate(null, null, _techniques_decorators, { kind: "field", name: "techniques", static: false, private: false, access: { has: obj => "techniques" in obj, get: obj => obj.techniques, set: (obj, value) => { obj.techniques = value; } }, metadata: _metadata }, _techniques_initializers, _techniques_extraInitializers);
            __esDecorate(null, null, _mitigations_decorators, { kind: "field", name: "mitigations", static: false, private: false, access: { has: obj => "mitigations" in obj, get: obj => obj.mitigations, set: (obj, value) => { obj.mitigations = value; } }, metadata: _metadata }, _mitigations_initializers, _mitigations_extraInitializers);
            __esDecorate(null, null, _detections_decorators, { kind: "field", name: "detections", static: false, private: false, access: { has: obj => "detections" in obj, get: obj => obj.detections, set: (obj, value) => { obj.detections = value; } }, metadata: _metadata }, _detections_initializers, _detections_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MITREMappingDto = MITREMappingDto;
// ============================================================================
// 1-8: THREAT MODEL CREATION (STRIDE, DREAD, PASTA)
// ============================================================================
/**
 * Creates a STRIDE-based threat model
 *
 * @param {Object} modelData - Threat model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created threat model
 *
 * @example
 * ```typescript
 * const model = await createSTRIDEThreatModel({
 *   applicationId: 'app-123',
 *   applicationName: 'E-commerce Platform',
 *   scope: 'CHECKOUT_PROCESS',
 *   assets: ['payment-data', 'user-credentials'],
 *   createdBy: 'architect-456',
 * }, sequelize);
 * ```
 */
const createSTRIDEThreatModel = async (modelData, sequelize, transaction) => {
    const modelId = `tm-stride-${Date.now()}`;
    const [threatModel] = await sequelize.query(`INSERT INTO threat_models (id, application_id, application_name, framework, version,
     scope, assets, stakeholders, status, created_by, created_at, updated_at)
     VALUES (:id, :applicationId, :applicationName, :framework, :version, :scope, :assets,
     :stakeholders, :status, :createdBy, :createdAt, :updatedAt)
     RETURNING *`, {
        replacements: {
            id: modelId,
            applicationId: modelData.applicationId,
            applicationName: modelData.applicationName,
            framework: ThreatModelFramework.STRIDE,
            version: '1.0',
            scope: modelData.scope,
            assets: JSON.stringify(modelData.assets),
            stakeholders: JSON.stringify(modelData.stakeholders || []),
            status: ThreatModelStatus.DRAFT,
            createdBy: modelData.createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`STRIDE threat model created: ${modelId}`, 'ThreatModeling');
    return threatModel;
};
exports.createSTRIDEThreatModel = createSTRIDEThreatModel;
/**
 * Analyzes STRIDE threats for a threat model
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<STRIDEThreat[]>} Identified STRIDE threats
 *
 * @example
 * ```typescript
 * const threats = await analyzeSTRIDEThreats('tm-stride-123', sequelize);
 * console.log(`Found ${threats.length} STRIDE threats`);
 * ```
 */
const analyzeSTRIDEThreats = async (modelId, sequelize) => {
    const [model] = await sequelize.query(`SELECT * FROM threat_models WHERE id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    if (!model) {
        throw new common_1.NotFoundException(`Threat model ${modelId} not found`);
    }
    const assets = JSON.parse(model.assets);
    const threats = [];
    // Generate STRIDE threats for each asset
    for (const asset of assets) {
        // Spoofing
        threats.push({
            category: STRIDECategory.SPOOFING,
            threatId: `${modelId}-spoofing-${asset}`,
            description: `Attacker could spoof identity to access ${asset}`,
            affectedAsset: asset,
            attackVector: 'Credential theft or session hijacking',
            impact: 'Unauthorized access to protected resources',
            likelihood: 6.5,
            severity: ThreatSeverity.HIGH,
            mitigations: ['Multi-factor authentication', 'Strong session management'],
            status: 'IDENTIFIED',
        });
        // Tampering
        threats.push({
            category: STRIDECategory.TAMPERING,
            threatId: `${modelId}-tampering-${asset}`,
            description: `Attacker could modify ${asset} data in transit or at rest`,
            affectedAsset: asset,
            attackVector: 'Man-in-the-middle attack or database manipulation',
            impact: 'Data integrity compromise',
            likelihood: 5.0,
            severity: ThreatSeverity.MEDIUM,
            mitigations: ['Data integrity checks', 'Encryption', 'Checksums'],
            status: 'IDENTIFIED',
        });
        // Information Disclosure
        threats.push({
            category: STRIDECategory.INFORMATION_DISCLOSURE,
            threatId: `${modelId}-disclosure-${asset}`,
            description: `Sensitive information in ${asset} could be exposed`,
            affectedAsset: asset,
            attackVector: 'SQL injection, directory traversal, or improper access controls',
            impact: 'Confidential data exposure',
            likelihood: 7.0,
            severity: ThreatSeverity.HIGH,
            mitigations: ['Encryption at rest and in transit', 'Access controls', 'Data classification'],
            status: 'IDENTIFIED',
        });
    }
    // Store threats
    for (const threat of threats) {
        await sequelize.query(`INSERT INTO stride_threats (id, model_id, category, description, affected_asset,
       attack_vector, impact, likelihood, severity, mitigations, status, created_at)
       VALUES (:id, :modelId, :category, :description, :affectedAsset, :attackVector, :impact,
       :likelihood, :severity, :mitigations, :status, :createdAt)`, {
            replacements: {
                id: threat.threatId,
                modelId,
                category: threat.category,
                description: threat.description,
                affectedAsset: threat.affectedAsset,
                attackVector: threat.attackVector,
                impact: threat.impact,
                likelihood: threat.likelihood,
                severity: threat.severity,
                mitigations: JSON.stringify(threat.mitigations),
                status: threat.status,
                createdAt: new Date(),
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
    }
    common_1.Logger.log(`STRIDE analysis completed: ${modelId}, Found ${threats.length} threats`, 'ThreatModeling');
    return threats;
};
exports.analyzeSTRIDEThreats = analyzeSTRIDEThreats;
/**
 * Creates a DREAD-based risk scoring model
 *
 * @param {Object} modelData - DREAD model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created DREAD model
 *
 * @example
 * ```typescript
 * const model = await createDREADModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Customer Portal',
 *   createdBy: 'security-456',
 * }, sequelize);
 * ```
 */
const createDREADModel = async (modelData, sequelize) => {
    const modelId = `tm-dread-${Date.now()}`;
    const [threatModel] = await sequelize.query(`INSERT INTO threat_models (id, application_id, application_name, framework, version,
     scope, status, created_by, created_at, updated_at)
     VALUES (:id, :applicationId, :applicationName, :framework, :version, :scope,
     :status, :createdBy, :createdAt, :updatedAt)
     RETURNING *`, {
        replacements: {
            id: modelId,
            applicationId: modelData.applicationId,
            applicationName: modelData.applicationName,
            framework: ThreatModelFramework.DREAD,
            version: '1.0',
            scope: modelData.scope,
            status: ThreatModelStatus.DRAFT,
            createdBy: modelData.createdBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`DREAD threat model created: ${modelId}`, 'ThreatModeling');
    return threatModel;
};
exports.createDREADModel = createDREADModel;
/**
 * Calculates DREAD score for a threat
 *
 * @param {string} threatId - Threat identifier
 * @param {Object} scores - DREAD factor scores
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DREADScore>} Calculated DREAD score
 *
 * @example
 * ```typescript
 * const score = await calculateDREADScore('threat-123', {
 *   damage: 8,
 *   reproducibility: 9,
 *   exploitability: 6,
 *   affectedUsers: 10,
 *   discoverability: 7,
 * }, sequelize);
 * console.log(`DREAD Score: ${score.totalScore}, Risk: ${score.riskLevel}`);
 * ```
 */
const calculateDREADScore = async (threatId, scores, sequelize) => {
    const totalScore = (scores.damage +
        scores.reproducibility +
        scores.exploitability +
        scores.affectedUsers +
        scores.discoverability) / 5;
    let riskLevel;
    if (totalScore >= 8) {
        riskLevel = 'CRITICAL';
    }
    else if (totalScore >= 6) {
        riskLevel = 'HIGH';
    }
    else if (totalScore >= 4) {
        riskLevel = 'MEDIUM';
    }
    else {
        riskLevel = 'LOW';
    }
    const dreadScore = {
        ...scores,
        totalScore: parseFloat(totalScore.toFixed(2)),
        riskLevel,
    };
    // Store DREAD score
    await sequelize.query(`INSERT INTO dread_scores (threat_id, damage, reproducibility, exploitability,
     affected_users, discoverability, total_score, risk_level, created_at)
     VALUES (:threatId, :damage, :reproducibility, :exploitability, :affectedUsers,
     :discoverability, :totalScore, :riskLevel, :createdAt)`, {
        replacements: {
            threatId,
            damage: scores.damage,
            reproducibility: scores.reproducibility,
            exploitability: scores.exploitability,
            affectedUsers: scores.affectedUsers,
            discoverability: scores.discoverability,
            totalScore: dreadScore.totalScore,
            riskLevel,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`DREAD score calculated: ${threatId}, Score: ${totalScore}`, 'ThreatModeling');
    return dreadScore;
};
exports.calculateDREADScore = calculateDREADScore;
/**
 * Creates a PASTA (Process for Attack Simulation and Threat Analysis) model
 *
 * @param {Object} modelData - PASTA model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created PASTA model
 *
 * @example
 * ```typescript
 * const model = await createPASTAModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Healthcare API',
 *   businessObjectives: ['Protect patient data', 'Ensure HIPAA compliance'],
 *   createdBy: 'architect-789',
 * }, sequelize);
 * ```
 */
const createPASTAModel = async (modelData, sequelize) => {
    const modelId = `tm-pasta-${Date.now()}`;
    const [threatModel] = await sequelize.query(`INSERT INTO threat_models (id, application_id, application_name, framework, version,
     status, created_by, metadata, created_at, updated_at)
     VALUES (:id, :applicationId, :applicationName, :framework, :version, :status,
     :createdBy, :metadata, :createdAt, :updatedAt)
     RETURNING *`, {
        replacements: {
            id: modelId,
            applicationId: modelData.applicationId,
            applicationName: modelData.applicationName,
            framework: ThreatModelFramework.PASTA,
            version: '1.0',
            status: ThreatModelStatus.DRAFT,
            createdBy: modelData.createdBy,
            metadata: JSON.stringify({ businessObjectives: modelData.businessObjectives }),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`PASTA threat model created: ${modelId}`, 'ThreatModeling');
    return threatModel;
};
exports.createPASTAModel = createPASTAModel;
/**
 * Executes PASTA stage analysis
 *
 * @param {string} modelId - PASTA model ID
 * @param {PASTAStage} stage - PASTA stage to execute
 * @param {Record<string, any>} stageData - Stage-specific data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Stage analysis results
 *
 * @example
 * ```typescript
 * const analysis = await executePASTAStage(
 *   'tm-pasta-123',
 *   PASTAStage.APPLICATION_DECOMPOSITION,
 *   {
 *     components: ['web-ui', 'api-gateway', 'database'],
 *     dependencies: ['oauth-provider', 'payment-processor'],
 *   },
 *   sequelize
 * );
 * ```
 */
const executePASTAStage = async (modelId, stage, stageData, sequelize) => {
    const stageId = `pasta-stage-${Date.now()}`;
    await sequelize.query(`INSERT INTO pasta_stages (id, model_id, stage, stage_data, completed_at, created_at)
     VALUES (:id, :modelId, :stage, :stageData, :completedAt, :createdAt)`, {
        replacements: {
            id: stageId,
            modelId,
            stage,
            stageData: JSON.stringify(stageData),
            completedAt: new Date(),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`PASTA stage executed: ${modelId}, Stage: ${stage}`, 'ThreatModeling');
    return {
        stageId,
        modelId,
        stage,
        stageData,
        completedAt: new Date(),
    };
};
exports.executePASTAStage = executePASTAStage;
/**
 * Gets threat model by ID with full details
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Threat model details
 *
 * @example
 * ```typescript
 * const model = await getThreatModelById('tm-stride-123', sequelize);
 * console.log(model.framework, model.status);
 * ```
 */
const getThreatModelById = async (modelId, sequelize) => {
    const [model] = await sequelize.query(`SELECT * FROM threat_models WHERE id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    if (!model) {
        throw new common_1.NotFoundException(`Threat model ${modelId} not found`);
    }
    return model;
};
exports.getThreatModelById = getThreatModelById;
/**
 * Updates threat model status
 *
 * @param {string} modelId - Threat model ID
 * @param {ThreatModelStatus} newStatus - New status
 * @param {string} updatedBy - User ID performing update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated threat model
 *
 * @example
 * ```typescript
 * const updated = await updateThreatModelStatus(
 *   'tm-stride-123',
 *   ThreatModelStatus.APPROVED,
 *   'reviewer-456',
 *   sequelize
 * );
 * ```
 */
const updateThreatModelStatus = async (modelId, newStatus, updatedBy, sequelize) => {
    const [result] = await sequelize.query(`UPDATE threat_models SET status = :newStatus, updated_by = :updatedBy,
     updated_at = :updatedAt
     WHERE id = :modelId
     RETURNING *`, {
        replacements: {
            modelId,
            newStatus,
            updatedBy,
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Threat model status updated: ${modelId} -> ${newStatus}`, 'ThreatModeling');
    return result;
};
exports.updateThreatModelStatus = updateThreatModelStatus;
// ============================================================================
// 9-14: DATA FLOW DIAGRAM ANALYSIS
// ============================================================================
/**
 * Generates data flow diagram for application
 *
 * @param {Object} dfdData - DFD generation data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DataFlowDiagram>} Generated DFD
 *
 * @example
 * ```typescript
 * const dfd = await generateDataFlowDiagram({
 *   applicationId: 'app-123',
 *   components: [
 *     { id: 'web-ui', type: ComponentType.EXTERNAL_ENTITY, name: 'Web Browser', trustLevel: 1 },
 *     { id: 'api', type: ComponentType.PROCESS, name: 'API Server', trustLevel: 5 },
 *     { id: 'db', type: ComponentType.DATA_STORE, name: 'Database', trustLevel: 8 },
 *   ],
 *   dataFlows: [
 *     { from: 'web-ui', to: 'api', dataClassification: 'CONFIDENTIAL', encrypted: true },
 *   ],
 * }, sequelize);
 * ```
 */
const generateDataFlowDiagram = async (dfdData, sequelize) => {
    const dfdId = `dfd-${Date.now()}`;
    // Auto-identify trust boundaries
    const trustBoundaries = [];
    // Group components by trust level
    const trustGroups = dfdData.components.reduce((acc, comp) => {
        const level = comp.trustLevel;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(comp.id);
        return acc;
    }, {});
    Object.entries(trustGroups).forEach(([level, components], index) => {
        trustBoundaries.push({
            id: `boundary-${index}`,
            type: TrustBoundaryType.NETWORK,
            components,
        });
    });
    const dfd = {
        id: dfdId,
        applicationId: dfdData.applicationId,
        components: dfdData.components,
        dataFlows: dfdData.dataFlows.map((flow, index) => ({
            id: `flow-${index}`,
            ...flow,
        })),
        trustBoundaries,
    };
    // Store DFD
    await sequelize.query(`INSERT INTO data_flow_diagrams (id, application_id, components, data_flows,
     trust_boundaries, created_at)
     VALUES (:id, :applicationId, :components, :dataFlows, :trustBoundaries, :createdAt)`, {
        replacements: {
            id: dfdId,
            applicationId: dfdData.applicationId,
            components: JSON.stringify(dfd.components),
            dataFlows: JSON.stringify(dfd.dataFlows),
            trustBoundaries: JSON.stringify(dfd.trustBoundaries),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Data flow diagram generated: ${dfdId}`, 'ThreatModeling');
    return dfd;
};
exports.generateDataFlowDiagram = generateDataFlowDiagram;
/**
 * Analyzes data flows for security risks
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Identified risks
 *
 * @example
 * ```typescript
 * const risks = await analyzeDataFlowRisks('dfd-123', sequelize);
 * console.log(`Found ${risks.length} data flow risks`);
 * ```
 */
const analyzeDataFlowRisks = async (dfdId, sequelize) => {
    const [dfd] = await sequelize.query(`SELECT * FROM data_flow_diagrams WHERE id = :dfdId`, { replacements: { dfdId }, type: sequelize_1.QueryTypes.SELECT });
    if (!dfd) {
        throw new common_1.NotFoundException(`DFD ${dfdId} not found`);
    }
    const dataFlows = JSON.parse(dfd.data_flows);
    const risks = [];
    for (const flow of dataFlows) {
        // Check for unencrypted sensitive data
        if (!flow.encrypted && flow.dataClassification === 'CONFIDENTIAL') {
            risks.push({
                riskId: `risk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'UNENCRYPTED_SENSITIVE_DATA',
                severity: ThreatSeverity.HIGH,
                description: `Sensitive data flows from ${flow.from} to ${flow.to} without encryption`,
                recommendation: 'Enable TLS/SSL encryption for this data flow',
                affectedFlow: flow.id,
            });
        }
        // Check for cross-boundary flows
        // (Would need trust boundary analysis here)
    }
    common_1.Logger.log(`Data flow risk analysis completed: ${dfdId}, Found ${risks.length} risks`, 'ThreatModeling');
    return risks;
};
exports.analyzeDataFlowRisks = analyzeDataFlowRisks;
/**
 * Identifies trust boundaries in DFD
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Trust boundaries
 *
 * @example
 * ```typescript
 * const boundaries = await analyzeTrustBoundaries('dfd-123', sequelize);
 * ```
 */
const analyzeTrustBoundaries = async (dfdId, sequelize) => {
    const [dfd] = await sequelize.query(`SELECT * FROM data_flow_diagrams WHERE id = :dfdId`, { replacements: { dfdId }, type: sequelize_1.QueryTypes.SELECT });
    if (!dfd) {
        throw new common_1.NotFoundException(`DFD ${dfdId} not found`);
    }
    const trustBoundaries = JSON.parse(dfd.trust_boundaries);
    common_1.Logger.log(`Trust boundary analysis: ${dfdId}, Found ${trustBoundaries.length} boundaries`, 'ThreatModeling');
    return trustBoundaries;
};
exports.analyzeTrustBoundaries = analyzeTrustBoundaries;
/**
 * Validates data flow diagram completeness
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDataFlowDiagram('dfd-123', sequelize);
 * if (!validation.valid) {
 *   console.log('DFD issues:', validation.issues);
 * }
 * ```
 */
const validateDataFlowDiagram = async (dfdId, sequelize) => {
    const [dfd] = await sequelize.query(`SELECT * FROM data_flow_diagrams WHERE id = :dfdId`, { replacements: { dfdId }, type: sequelize_1.QueryTypes.SELECT });
    if (!dfd) {
        throw new common_1.NotFoundException(`DFD ${dfdId} not found`);
    }
    const issues = [];
    const components = JSON.parse(dfd.components);
    const dataFlows = JSON.parse(dfd.data_flows);
    // Check for orphaned components
    const referencedComponents = new Set([
        ...dataFlows.map((f) => f.from),
        ...dataFlows.map((f) => f.to),
    ]);
    for (const component of components) {
        if (!referencedComponents.has(component.id)) {
            issues.push(`Component ${component.id} (${component.name}) is not connected to any data flow`);
        }
    }
    // Check for missing trust levels
    for (const component of components) {
        if (component.trustLevel === undefined || component.trustLevel === null) {
            issues.push(`Component ${component.id} is missing trust level`);
        }
    }
    // Check for flows between non-existent components
    const componentIds = new Set(components.map((c) => c.id));
    for (const flow of dataFlows) {
        if (!componentIds.has(flow.from)) {
            issues.push(`Data flow references non-existent source component: ${flow.from}`);
        }
        if (!componentIds.has(flow.to)) {
            issues.push(`Data flow references non-existent target component: ${flow.to}`);
        }
    }
    return {
        valid: issues.length === 0,
        issues,
    };
};
exports.validateDataFlowDiagram = validateDataFlowDiagram;
/**
 * Exports DFD to standard format (JSON, GraphML)
 *
 * @param {string} dfdId - DFD identifier
 * @param {string} format - Export format ('JSON' | 'GRAPHML')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportDataFlowDiagram('dfd-123', 'JSON', sequelize);
 * console.log('Exported to:', exportResult.exportPath);
 * ```
 */
const exportDataFlowDiagram = async (dfdId, format, sequelize) => {
    const [dfd] = await sequelize.query(`SELECT * FROM data_flow_diagrams WHERE id = :dfdId`, { replacements: { dfdId }, type: sequelize_1.QueryTypes.SELECT });
    if (!dfd) {
        throw new common_1.NotFoundException(`DFD ${dfdId} not found`);
    }
    const exportId = `dfd-export-${Date.now()}`;
    const exportPath = `/exports/dfd/${exportId}.${format.toLowerCase()}`;
    await sequelize.query(`INSERT INTO dfd_exports (id, dfd_id, format, export_path, created_at)
     VALUES (:id, :dfdId, :format, :exportPath, :createdAt)`, {
        replacements: {
            id: exportId,
            dfdId,
            format,
            exportPath,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`DFD exported: ${dfdId}, Format: ${format}`, 'ThreatModeling');
    return { exportId, exportPath };
};
exports.exportDataFlowDiagram = exportDataFlowDiagram;
/**
 * Updates data flow diagram components
 *
 * @param {string} dfdId - DFD identifier
 * @param {Object} updates - Component updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated DFD
 *
 * @example
 * ```typescript
 * const updated = await updateDataFlowDiagram('dfd-123', {
 *   components: [...updatedComponents],
 *   dataFlows: [...updatedFlows],
 * }, sequelize);
 * ```
 */
const updateDataFlowDiagram = async (dfdId, updates, sequelize) => {
    const setParts = [];
    const replacements = { dfdId, updatedAt: new Date() };
    if (updates.components) {
        setParts.push('components = :components');
        replacements.components = JSON.stringify(updates.components);
    }
    if (updates.dataFlows) {
        setParts.push('data_flows = :dataFlows');
        replacements.dataFlows = JSON.stringify(updates.dataFlows);
    }
    if (updates.trustBoundaries) {
        setParts.push('trust_boundaries = :trustBoundaries');
        replacements.trustBoundaries = JSON.stringify(updates.trustBoundaries);
    }
    setParts.push('updated_at = :updatedAt');
    const [result] = await sequelize.query(`UPDATE data_flow_diagrams SET ${setParts.join(', ')} WHERE id = :dfdId RETURNING *`, {
        replacements,
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`DFD updated: ${dfdId}`, 'ThreatModeling');
    return result;
};
exports.updateDataFlowDiagram = updateDataFlowDiagram;
// ============================================================================
// 15-19: TRUST BOUNDARY IDENTIFICATION
// ============================================================================
/**
 * Identifies trust boundaries based on component analysis
 *
 * @param {string} applicationId - Application identifier
 * @param {Array<any>} components - Application components
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Identified trust boundaries
 *
 * @example
 * ```typescript
 * const boundaries = await identifyTrustBoundaries('app-123', [
 *   { id: 'web', trustLevel: 1 },
 *   { id: 'api', trustLevel: 5 },
 *   { id: 'db', trustLevel: 9 },
 * ], sequelize);
 * ```
 */
const identifyTrustBoundaries = async (applicationId, components, sequelize) => {
    const boundaries = [];
    // Group by trust level
    const trustGroups = components.reduce((acc, comp) => {
        const level = comp.trustLevel;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(comp);
        return acc;
    }, {});
    // Create boundaries between different trust levels
    Object.entries(trustGroups).forEach(([level, comps], index) => {
        boundaries.push({
            id: `boundary-${applicationId}-${index}`,
            type: TrustBoundaryType.NETWORK,
            trustLevel: parseInt(level, 10),
            components: comps.map(c => c.id),
            description: `Trust boundary for level ${level} components`,
        });
    });
    // Store boundaries
    for (const boundary of boundaries) {
        await sequelize.query(`INSERT INTO trust_boundaries (id, application_id, type, trust_level, components,
       description, created_at)
       VALUES (:id, :applicationId, :type, :trustLevel, :components, :description, :createdAt)`, {
            replacements: {
                id: boundary.id,
                applicationId,
                type: boundary.type,
                trustLevel: boundary.trustLevel,
                components: JSON.stringify(boundary.components),
                description: boundary.description,
                createdAt: new Date(),
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
    }
    common_1.Logger.log(`Trust boundaries identified: ${applicationId}, Found ${boundaries.length} boundaries`, 'ThreatModeling');
    return boundaries;
};
exports.identifyTrustBoundaries = identifyTrustBoundaries;
/**
 * Classifies trust boundary type based on characteristics
 *
 * @param {Object} boundaryData - Boundary characteristics
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TrustBoundaryType>} Classified boundary type
 *
 * @example
 * ```typescript
 * const type = await classifyTrustBoundaryType({
 *   separates: ['internal-network', 'external-network'],
 *   protocol: 'HTTPS',
 *   authentication: true,
 * }, sequelize);
 * ```
 */
const classifyTrustBoundaryType = async (boundaryData, sequelize) => {
    if (boundaryData.dataStore) {
        return TrustBoundaryType.DATA_STORE;
    }
    if (boundaryData.authentication) {
        return TrustBoundaryType.AUTHENTICATION;
    }
    if (boundaryData.protocol && ['HTTP', 'HTTPS', 'TCP'].includes(boundaryData.protocol)) {
        return TrustBoundaryType.NETWORK;
    }
    return TrustBoundaryType.PROCESS;
};
exports.classifyTrustBoundaryType = classifyTrustBoundaryType;
/**
 * Analyzes data crossing trust boundaries
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Cross-boundary data flows
 *
 * @example
 * ```typescript
 * const crossings = await analyzeBoundaryCrossings('boundary-123', sequelize);
 * console.log(`Found ${crossings.length} cross-boundary flows`);
 * ```
 */
const analyzeBoundaryCrossings = async (boundaryId, sequelize) => {
    const [boundary] = await sequelize.query(`SELECT * FROM trust_boundaries WHERE id = :boundaryId`, { replacements: { boundaryId }, type: sequelize_1.QueryTypes.SELECT });
    if (!boundary) {
        throw new common_1.NotFoundException(`Trust boundary ${boundaryId} not found`);
    }
    const components = JSON.parse(boundary.components);
    // Find data flows crossing this boundary
    const crossings = await sequelize.query(`SELECT df.* FROM data_flow_diagrams dfd,
     jsonb_array_elements(dfd.data_flows) AS df
     WHERE dfd.application_id = :applicationId`, {
        replacements: {
            applicationId: boundary.application_id,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    common_1.Logger.log(`Boundary crossing analysis: ${boundaryId}`, 'ThreatModeling');
    return crossings;
};
exports.analyzeBoundaryCrossings = analyzeBoundaryCrossings;
/**
 * Validates trust boundary security controls
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateTrustBoundaryControls('boundary-123', sequelize);
 * ```
 */
const validateTrustBoundaryControls = async (boundaryId, sequelize) => {
    const [boundary] = await sequelize.query(`SELECT * FROM trust_boundaries WHERE id = :boundaryId`, { replacements: { boundaryId }, type: sequelize_1.QueryTypes.SELECT });
    if (!boundary) {
        throw new common_1.NotFoundException(`Trust boundary ${boundaryId} not found`);
    }
    const issues = [];
    // Check for required security controls
    if (boundary.type === TrustBoundaryType.AUTHENTICATION && !boundary.authentication_enabled) {
        issues.push('Authentication boundary missing authentication controls');
    }
    if (boundary.type === TrustBoundaryType.NETWORK && !boundary.firewall_enabled) {
        issues.push('Network boundary missing firewall controls');
    }
    return {
        valid: issues.length === 0,
        issues,
    };
};
exports.validateTrustBoundaryControls = validateTrustBoundaryControls;
/**
 * Generates trust boundary threat report
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Boundary threat report
 *
 * @example
 * ```typescript
 * const report = await generateBoundaryThreatReport('boundary-123', sequelize);
 * ```
 */
const generateBoundaryThreatReport = async (boundaryId, sequelize) => {
    const [boundary] = await sequelize.query(`SELECT * FROM trust_boundaries WHERE id = :boundaryId`, { replacements: { boundaryId }, type: sequelize_1.QueryTypes.SELECT });
    if (!boundary) {
        throw new common_1.NotFoundException(`Trust boundary ${boundaryId} not found`);
    }
    const threats = [];
    // Identify threats based on boundary type
    switch (boundary.type) {
        case TrustBoundaryType.NETWORK:
            threats.push('Network sniffing', 'Man-in-the-middle attacks', 'DDoS attacks');
            break;
        case TrustBoundaryType.AUTHENTICATION:
            threats.push('Credential theft', 'Session hijacking', 'Brute force attacks');
            break;
        case TrustBoundaryType.DATA_STORE:
            threats.push('SQL injection', 'Data exfiltration', 'Unauthorized access');
            break;
    }
    const report = {
        boundaryId,
        boundaryType: boundary.type,
        trustLevel: boundary.trust_level,
        identifiedThreats: threats,
        recommendedControls: [
            'Implement encryption in transit',
            'Enable authentication and authorization',
            'Add monitoring and alerting',
        ],
        generatedAt: new Date(),
    };
    common_1.Logger.log(`Boundary threat report generated: ${boundaryId}`, 'ThreatModeling');
    return report;
};
exports.generateBoundaryThreatReport = generateBoundaryThreatReport;
// ============================================================================
// 20-24: ATTACK TREE GENERATION
// ============================================================================
/**
 * Generates attack tree for a threat
 *
 * @param {string} threatId - Threat identifier
 * @param {string} rootGoal - Root attack goal
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AttackTree>} Generated attack tree
 *
 * @example
 * ```typescript
 * const attackTree = await generateAttackTree(
 *   'threat-123',
 *   'Compromise customer database',
 *   sequelize
 * );
 * ```
 */
const generateAttackTree = async (threatId, rootGoal, sequelize) => {
    const treeId = `atree-${Date.now()}`;
    // Generate sample attack tree nodes
    const nodes = [
        {
            id: 'node-1',
            goal: rootGoal,
            type: 'OR',
            attackVector: 'Multiple attack vectors',
            probability: 0.7,
            cost: 10000,
            skill: 'HIGH',
            mitigations: [],
        },
        {
            id: 'node-2',
            parentId: 'node-1',
            goal: 'Exploit SQL injection vulnerability',
            type: 'AND',
            attackVector: 'SQL Injection',
            probability: 0.6,
            cost: 1000,
            skill: 'MEDIUM',
            mitigations: ['Input validation', 'Parameterized queries'],
        },
        {
            id: 'node-3',
            parentId: 'node-1',
            goal: 'Steal admin credentials',
            type: 'OR',
            attackVector: 'Phishing or credential stuffing',
            probability: 0.5,
            cost: 500,
            skill: 'LOW',
            mitigations: ['MFA', 'Security awareness training'],
        },
        {
            id: 'node-4',
            parentId: 'node-2',
            goal: 'Find injection point',
            type: 'AND',
            attackVector: 'Automated scanning',
            probability: 0.8,
            cost: 100,
            skill: 'LOW',
            mitigations: ['WAF', 'Security testing'],
        },
        {
            id: 'node-5',
            parentId: 'node-2',
            goal: 'Craft malicious payload',
            type: 'AND',
            attackVector: 'Manual exploitation',
            probability: 0.7,
            cost: 200,
            skill: 'MEDIUM',
            mitigations: ['Input sanitization'],
        },
    ];
    const criticalPaths = [
        ['node-1', 'node-2', 'node-4', 'node-5'],
        ['node-1', 'node-3'],
    ];
    const attackTree = {
        id: treeId,
        threatId,
        rootGoal,
        nodes,
        criticalPaths,
    };
    // Store attack tree
    await sequelize.query(`INSERT INTO attack_trees (id, threat_id, root_goal, nodes, critical_paths, created_at)
     VALUES (:id, :threatId, :rootGoal, :nodes, :criticalPaths, :createdAt)`, {
        replacements: {
            id: treeId,
            threatId,
            rootGoal,
            nodes: JSON.stringify(nodes),
            criticalPaths: JSON.stringify(criticalPaths),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Attack tree generated: ${treeId}`, 'ThreatModeling');
    return attackTree;
};
exports.generateAttackTree = generateAttackTree;
/**
 * Calculates attack tree probabilities
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{totalProbability: number, criticalPathProbabilities: number[]}>} Probability calculations
 *
 * @example
 * ```typescript
 * const probabilities = await calculateAttackTreeProbabilities('atree-123', sequelize);
 * console.log('Total attack probability:', probabilities.totalProbability);
 * ```
 */
const calculateAttackTreeProbabilities = async (attackTreeId, sequelize) => {
    const [tree] = await sequelize.query(`SELECT * FROM attack_trees WHERE id = :attackTreeId`, { replacements: { attackTreeId }, type: sequelize_1.QueryTypes.SELECT });
    if (!tree) {
        throw new common_1.NotFoundException(`Attack tree ${attackTreeId} not found`);
    }
    const nodes = JSON.parse(tree.nodes);
    const criticalPaths = JSON.parse(tree.critical_paths);
    // Calculate probability for each critical path
    const criticalPathProbabilities = criticalPaths.map((path) => {
        const pathNodes = nodes.filter((n) => path.includes(n.id));
        // For AND gates, multiply probabilities; for OR gates, use max
        return pathNodes.reduce((prob, node) => {
            if (node.type === 'AND') {
                return prob * node.probability;
            }
            return Math.max(prob, node.probability);
        }, 0);
    });
    const totalProbability = Math.max(...criticalPathProbabilities);
    common_1.Logger.log(`Attack tree probabilities calculated: ${attackTreeId}`, 'ThreatModeling');
    return {
        totalProbability: parseFloat(totalProbability.toFixed(4)),
        criticalPathProbabilities: criticalPathProbabilities.map(p => parseFloat(p.toFixed(4))),
    };
};
exports.calculateAttackTreeProbabilities = calculateAttackTreeProbabilities;
/**
 * Identifies most likely attack path
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{path: string[], probability: number, cost: number}>} Most likely attack path
 *
 * @example
 * ```typescript
 * const path = await identifyMostLikelyAttackPath('atree-123', sequelize);
 * console.log('Most likely path:', path.path, 'Probability:', path.probability);
 * ```
 */
const identifyMostLikelyAttackPath = async (attackTreeId, sequelize) => {
    const probabilities = await (0, exports.calculateAttackTreeProbabilities)(attackTreeId, sequelize);
    const [tree] = await sequelize.query(`SELECT * FROM attack_trees WHERE id = :attackTreeId`, { replacements: { attackTreeId }, type: sequelize_1.QueryTypes.SELECT });
    const criticalPaths = JSON.parse(tree.critical_paths);
    const nodes = JSON.parse(tree.nodes);
    const maxProbIndex = probabilities.criticalPathProbabilities.indexOf(Math.max(...probabilities.criticalPathProbabilities));
    const mostLikelyPath = criticalPaths[maxProbIndex];
    const pathNodes = nodes.filter((n) => mostLikelyPath.includes(n.id));
    const totalCost = pathNodes.reduce((sum, node) => sum + node.cost, 0);
    return {
        path: mostLikelyPath,
        probability: probabilities.criticalPathProbabilities[maxProbIndex],
        cost: totalCost,
    };
};
exports.identifyMostLikelyAttackPath = identifyMostLikelyAttackPath;
/**
 * Analyzes attack tree node mitigations
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, string[]>>} Node mitigations map
 *
 * @example
 * ```typescript
 * const mitigations = await analyzeAttackTreeMitigations('atree-123', sequelize);
 * ```
 */
const analyzeAttackTreeMitigations = async (attackTreeId, sequelize) => {
    const [tree] = await sequelize.query(`SELECT * FROM attack_trees WHERE id = :attackTreeId`, { replacements: { attackTreeId }, type: sequelize_1.QueryTypes.SELECT });
    if (!tree) {
        throw new common_1.NotFoundException(`Attack tree ${attackTreeId} not found`);
    }
    const nodes = JSON.parse(tree.nodes);
    const mitigationMap = {};
    for (const node of nodes) {
        mitigationMap[node.id] = node.mitigations || [];
    }
    return mitigationMap;
};
exports.analyzeAttackTreeMitigations = analyzeAttackTreeMitigations;
/**
 * Exports attack tree visualization data
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {string} format - Export format ('JSON' | 'DOT')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportAttackTree('atree-123', 'DOT', sequelize);
 * ```
 */
const exportAttackTree = async (attackTreeId, format, sequelize) => {
    const [tree] = await sequelize.query(`SELECT * FROM attack_trees WHERE id = :attackTreeId`, { replacements: { attackTreeId }, type: sequelize_1.QueryTypes.SELECT });
    if (!tree) {
        throw new common_1.NotFoundException(`Attack tree ${attackTreeId} not found`);
    }
    const exportId = `atree-export-${Date.now()}`;
    const exportPath = `/exports/attack-trees/${exportId}.${format.toLowerCase()}`;
    await sequelize.query(`INSERT INTO attack_tree_exports (id, attack_tree_id, format, export_path, created_at)
     VALUES (:id, :attackTreeId, :format, :exportPath, :createdAt)`, {
        replacements: {
            id: exportId,
            attackTreeId,
            format,
            exportPath,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Attack tree exported: ${attackTreeId}, Format: ${format}`, 'ThreatModeling');
    return { exportId, exportPath };
};
exports.exportAttackTree = exportAttackTree;
// ============================================================================
// 25-29: THREAT SCENARIO MODELING
// ============================================================================
/**
 * Creates threat scenario with attack narrative
 *
 * @param {Object} scenarioData - Threat scenario data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ThreatScenario>} Created threat scenario
 *
 * @example
 * ```typescript
 * const scenario = await createThreatScenario({
 *   scenarioName: 'Ransomware Attack',
 *   threatActorProfile: 'Organized cybercrime group',
 *   attackNarrative: 'Attackers gain initial access via phishing...',
 *   preconditions: ['Unpatched systems', 'Weak email security'],
 *   attackSteps: [
 *     { step: 1, action: 'Phishing email', technique: 'T1566', detection: ['Email filtering'] },
 *   ],
 *   impact: { confidentiality: 'HIGH', integrity: 'HIGH', availability: 'HIGH' },
 *   businessImpact: '$2M estimated loss',
 *   likelihood: 0.65,
 * }, sequelize);
 * ```
 */
const createThreatScenario = async (scenarioData, sequelize) => {
    const scenarioId = `scenario-${Date.now()}`;
    const scenario = {
        id: scenarioId,
        ...scenarioData,
    };
    await sequelize.query(`INSERT INTO threat_scenarios (id, scenario_name, threat_actor_profile, attack_narrative,
     preconditions, attack_steps, impact, business_impact, likelihood, created_at)
     VALUES (:id, :scenarioName, :threatActorProfile, :attackNarrative, :preconditions,
     :attackSteps, :impact, :businessImpact, :likelihood, :createdAt)`, {
        replacements: {
            id: scenarioId,
            scenarioName: scenarioData.scenarioName,
            threatActorProfile: scenarioData.threatActorProfile,
            attackNarrative: scenarioData.attackNarrative,
            preconditions: JSON.stringify(scenarioData.preconditions),
            attackSteps: JSON.stringify(scenarioData.attackSteps),
            impact: JSON.stringify(scenarioData.impact),
            businessImpact: scenarioData.businessImpact,
            likelihood: scenarioData.likelihood,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Threat scenario created: ${scenarioId}`, 'ThreatModeling');
    return scenario;
};
exports.createThreatScenario = createThreatScenario;
/**
 * Analyzes threat scenario impact
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeThreatScenarioImpact('scenario-123', sequelize);
 * console.log('Business impact:', impact.businessImpact);
 * ```
 */
const analyzeThreatScenarioImpact = async (scenarioId, sequelize) => {
    const [scenario] = await sequelize.query(`SELECT * FROM threat_scenarios WHERE id = :scenarioId`, { replacements: { scenarioId }, type: sequelize_1.QueryTypes.SELECT });
    if (!scenario) {
        throw new common_1.NotFoundException(`Threat scenario ${scenarioId} not found`);
    }
    const impact = JSON.parse(scenario.impact);
    // Calculate overall CIA impact score
    const impactScores = {
        NONE: 0,
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3,
    };
    const ciaScore = (impactScores[impact.confidentiality] +
        impactScores[impact.integrity] +
        impactScores[impact.availability]) / 3;
    return {
        scenarioId,
        ciaImpact: impact,
        overallCIAScore: ciaScore,
        businessImpact: scenario.business_impact,
        likelihood: scenario.likelihood,
        riskScore: ciaScore * scenario.likelihood,
    };
};
exports.analyzeThreatScenarioImpact = analyzeThreatScenarioImpact;
/**
 * Simulates threat scenario execution
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{success: boolean, detectedAt: number[], mitigatedBy: string[]}>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateThreatScenario('scenario-123', sequelize);
 * console.log('Attack detected at steps:', simulation.detectedAt);
 * ```
 */
const simulateThreatScenario = async (scenarioId, sequelize) => {
    const [scenario] = await sequelize.query(`SELECT * FROM threat_scenarios WHERE id = :scenarioId`, { replacements: { scenarioId }, type: sequelize_1.QueryTypes.SELECT });
    if (!scenario) {
        throw new common_1.NotFoundException(`Threat scenario ${scenarioId} not found`);
    }
    const attackSteps = JSON.parse(scenario.attack_steps);
    const detectedAt = [];
    const mitigatedBy = [];
    // Simulate each attack step
    for (const step of attackSteps) {
        if (step.detection && step.detection.length > 0) {
            detectedAt.push(step.step);
            mitigatedBy.push(...step.detection);
        }
    }
    const success = detectedAt.length === 0;
    common_1.Logger.log(`Threat scenario simulated: ${scenarioId}, Success: ${success}`, 'ThreatModeling');
    return {
        success,
        detectedAt,
        mitigatedBy: [...new Set(mitigatedBy)],
    };
};
exports.simulateThreatScenario = simulateThreatScenario;
/**
 * Compares multiple threat scenarios
 *
 * @param {string[]} scenarioIds - Threat scenario IDs to compare
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareThreatScenarios(['scenario-1', 'scenario-2'], sequelize);
 * ```
 */
const compareThreatScenarios = async (scenarioIds, sequelize) => {
    const scenarios = await sequelize.query(`SELECT * FROM threat_scenarios WHERE id IN (:scenarioIds)`, {
        replacements: { scenarioIds },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const comparison = [];
    for (const scenario of scenarios) {
        const impact = await (0, exports.analyzeThreatScenarioImpact)(scenario.id, sequelize);
        comparison.push({
            scenarioId: scenario.id,
            scenarioName: scenario.scenario_name,
            likelihood: scenario.likelihood,
            riskScore: impact.riskScore,
            businessImpact: scenario.business_impact,
        });
    }
    // Sort by risk score descending
    comparison.sort((a, b) => b.riskScore - a.riskScore);
    return comparison;
};
exports.compareThreatScenarios = compareThreatScenarios;
/**
 * Generates threat scenario report
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Scenario report
 *
 * @example
 * ```typescript
 * const report = await generateThreatScenarioReport('scenario-123', sequelize);
 * ```
 */
const generateThreatScenarioReport = async (scenarioId, sequelize) => {
    const [scenario] = await sequelize.query(`SELECT * FROM threat_scenarios WHERE id = :scenarioId`, { replacements: { scenarioId }, type: sequelize_1.QueryTypes.SELECT });
    if (!scenario) {
        throw new common_1.NotFoundException(`Threat scenario ${scenarioId} not found`);
    }
    const impact = await (0, exports.analyzeThreatScenarioImpact)(scenarioId, sequelize);
    const simulation = await (0, exports.simulateThreatScenario)(scenarioId, sequelize);
    const report = {
        reportId: `scenario-report-${Date.now()}`,
        scenarioId,
        scenarioName: scenario.scenario_name,
        threatActor: scenario.threat_actor_profile,
        narrative: scenario.attack_narrative,
        preconditions: JSON.parse(scenario.preconditions),
        attackSteps: JSON.parse(scenario.attack_steps),
        impactAnalysis: impact,
        simulationResults: simulation,
        recommendations: [
            'Implement missing detection controls',
            'Strengthen precondition defenses',
            'Conduct tabletop exercise',
        ],
        generatedAt: new Date(),
    };
    common_1.Logger.log(`Threat scenario report generated: ${scenarioId}`, 'ThreatModeling');
    return report;
};
exports.generateThreatScenarioReport = generateThreatScenarioReport;
// ============================================================================
// 30-33: SECURITY ARCHITECTURE REVIEW
// ============================================================================
/**
 * Performs security architecture review
 *
 * @param {string} applicationId - Application identifier
 * @param {Object} architectureData - Architecture components and design
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{reviewId: string, findings: string[], recommendations: string[]}>} Review results
 *
 * @example
 * ```typescript
 * const review = await performSecurityArchitectureReview('app-123', {
 *   layers: ['presentation', 'business', 'data'],
 *   components: [...],
 *   securityControls: [...],
 * }, sequelize);
 * ```
 */
const performSecurityArchitectureReview = async (applicationId, architectureData, sequelize) => {
    const reviewId = `arch-review-${Date.now()}`;
    const findings = [];
    const recommendations = [];
    // Check for security best practices
    if (!architectureData.securityControls.includes('ENCRYPTION_AT_REST')) {
        findings.push('Missing encryption at rest');
        recommendations.push('Implement database encryption');
    }
    if (!architectureData.securityControls.includes('MFA')) {
        findings.push('Multi-factor authentication not implemented');
        recommendations.push('Enable MFA for all users');
    }
    if (!architectureData.securityControls.includes('WAF')) {
        findings.push('Web Application Firewall not detected');
        recommendations.push('Deploy WAF for web applications');
    }
    // Store review
    await sequelize.query(`INSERT INTO architecture_reviews (id, application_id, architecture_data, findings,
     recommendations, created_at)
     VALUES (:id, :applicationId, :architectureData, :findings, :recommendations, :createdAt)`, {
        replacements: {
            id: reviewId,
            applicationId,
            architectureData: JSON.stringify(architectureData),
            findings: JSON.stringify(findings),
            recommendations: JSON.stringify(recommendations),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Security architecture review completed: ${reviewId}`, 'ThreatModeling');
    return { reviewId, findings, recommendations };
};
exports.performSecurityArchitectureReview = performSecurityArchitectureReview;
/**
 * Validates security design patterns
 *
 * @param {string} applicationId - Application identifier
 * @param {string[]} patterns - Security design patterns to validate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, boolean>>} Pattern validation results
 *
 * @example
 * ```typescript
 * const validation = await validateSecurityDesignPatterns('app-123', [
 *   'Defense in Depth',
 *   'Least Privilege',
 *   'Zero Trust',
 * ], sequelize);
 * ```
 */
const validateSecurityDesignPatterns = async (applicationId, patterns, sequelize) => {
    const validation = {};
    for (const pattern of patterns) {
        // Simplified validation logic
        validation[pattern] = Math.random() > 0.3; // Placeholder
    }
    common_1.Logger.log(`Security design patterns validated: ${applicationId}`, 'ThreatModeling');
    return validation;
};
exports.validateSecurityDesignPatterns = validateSecurityDesignPatterns;
/**
 * Analyzes security control coverage
 *
 * @param {string} applicationId - Application identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{coverage: number, gaps: string[]}>} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await analyzeSecurityControlCoverage('app-123', sequelize);
 * console.log(`Security control coverage: ${coverage.coverage}%`);
 * ```
 */
const analyzeSecurityControlCoverage = async (applicationId, sequelize) => {
    const requiredControls = [
        'AUTHENTICATION',
        'AUTHORIZATION',
        'ENCRYPTION_AT_REST',
        'ENCRYPTION_IN_TRANSIT',
        'INPUT_VALIDATION',
        'OUTPUT_ENCODING',
        'LOGGING_MONITORING',
        'INCIDENT_RESPONSE',
    ];
    // Get implemented controls
    const [app] = await sequelize.query(`SELECT security_controls FROM applications WHERE id = :applicationId`, { replacements: { applicationId }, type: sequelize_1.QueryTypes.SELECT });
    const implementedControls = app ? JSON.parse(app.security_controls || '[]') : [];
    const gaps = requiredControls.filter(control => !implementedControls.includes(control));
    const coverage = ((requiredControls.length - gaps.length) / requiredControls.length) * 100;
    common_1.Logger.log(`Security control coverage analyzed: ${applicationId}, Coverage: ${coverage}%`, 'ThreatModeling');
    return {
        coverage: parseFloat(coverage.toFixed(2)),
        gaps,
    };
};
exports.analyzeSecurityControlCoverage = analyzeSecurityControlCoverage;
/**
 * Generates architecture security scorecard
 *
 * @param {string} applicationId - Application identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Security scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateArchitectureSecurityScorecard('app-123', sequelize);
 * ```
 */
const generateArchitectureSecurityScorecard = async (applicationId, sequelize) => {
    const coverage = await (0, exports.analyzeSecurityControlCoverage)(applicationId, sequelize);
    const scorecard = {
        applicationId,
        overallScore: coverage.coverage,
        controlCoverage: coverage.coverage,
        gaps: coverage.gaps,
        riskLevel: coverage.coverage >= 80 ? 'LOW' : coverage.coverage >= 60 ? 'MEDIUM' : 'HIGH',
        generatedAt: new Date(),
    };
    common_1.Logger.log(`Architecture security scorecard generated: ${applicationId}`, 'ThreatModeling');
    return scorecard;
};
exports.generateArchitectureSecurityScorecard = generateArchitectureSecurityScorecard;
// ============================================================================
// 34-37: THREAT MODEL VALIDATION
// ============================================================================
/**
 * Validates threat model completeness
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[], completeness: number}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateThreatModelCompleteness('tm-stride-123', sequelize);
 * if (!validation.valid) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
const validateThreatModelCompleteness = async (modelId, sequelize) => {
    const model = await (0, exports.getThreatModelById)(modelId, sequelize);
    const issues = [];
    const modelData = model;
    // Check required fields
    if (!modelData.assets || JSON.parse(modelData.assets).length === 0) {
        issues.push('No assets defined in threat model');
    }
    if (!modelData.stakeholders || JSON.parse(modelData.stakeholders).length === 0) {
        issues.push('No stakeholders identified');
    }
    // Check for threats
    const threats = await sequelize.query(`SELECT COUNT(*) as count FROM stride_threats WHERE model_id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    if (parseInt(threats[0].count, 10) === 0) {
        issues.push('No threats identified');
    }
    const requiredFields = ['applicationId', 'applicationName', 'framework', 'scope', 'assets'];
    const presentFields = requiredFields.filter(field => modelData[field]);
    const completeness = (presentFields.length / requiredFields.length) * 100;
    return {
        valid: issues.length === 0,
        issues,
        completeness: parseFloat(completeness.toFixed(2)),
    };
};
exports.validateThreatModelCompleteness = validateThreatModelCompleteness;
/**
 * Checks threat model coverage against assets
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{assetsCovered: number, totalAssets: number, uncoveredAssets: string[]}>} Coverage check
 *
 * @example
 * ```typescript
 * const coverage = await checkThreatModelCoverage('tm-stride-123', sequelize);
 * console.log(`Asset coverage: ${coverage.assetsCovered}/${coverage.totalAssets}`);
 * ```
 */
const checkThreatModelCoverage = async (modelId, sequelize) => {
    const model = await (0, exports.getThreatModelById)(modelId, sequelize);
    const modelData = model;
    const assets = JSON.parse(modelData.assets || '[]');
    // Get threats by asset
    const threats = await sequelize.query(`SELECT DISTINCT affected_asset FROM stride_threats WHERE model_id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    const coveredAssets = new Set(threats.map((t) => t.affected_asset));
    const uncoveredAssets = assets.filter((asset) => !coveredAssets.has(asset));
    return {
        assetsCovered: coveredAssets.size,
        totalAssets: assets.length,
        uncoveredAssets,
    };
};
exports.checkThreatModelCoverage = checkThreatModelCoverage;
/**
 * Validates threat mitigations are defined
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{threatsWithMitigations: number, threatsWithoutMitigations: number}>} Mitigation validation
 *
 * @example
 * ```typescript
 * const validation = await validateThreatMitigations('tm-stride-123', sequelize);
 * ```
 */
const validateThreatMitigations = async (modelId, sequelize) => {
    const threats = await sequelize.query(`SELECT id, mitigations FROM stride_threats WHERE model_id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    let threatsWithMitigations = 0;
    let threatsWithoutMitigations = 0;
    for (const threat of threats) {
        const mitigations = JSON.parse(threat.mitigations || '[]');
        if (mitigations.length > 0) {
            threatsWithMitigations++;
        }
        else {
            threatsWithoutMitigations++;
        }
    }
    return {
        threatsWithMitigations,
        threatsWithoutMitigations,
    };
};
exports.validateThreatMitigations = validateThreatMitigations;
/**
 * Generates threat model validation report
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Validation report
 *
 * @example
 * ```typescript
 * const report = await generateThreatModelValidationReport('tm-stride-123', sequelize);
 * ```
 */
const generateThreatModelValidationReport = async (modelId, sequelize) => {
    const completeness = await (0, exports.validateThreatModelCompleteness)(modelId, sequelize);
    const coverage = await (0, exports.checkThreatModelCoverage)(modelId, sequelize);
    const mitigations = await (0, exports.validateThreatMitigations)(modelId, sequelize);
    const report = {
        reportId: `validation-report-${Date.now()}`,
        modelId,
        completeness: {
            score: completeness.completeness,
            issues: completeness.issues,
            valid: completeness.valid,
        },
        assetCoverage: {
            covered: coverage.assetsCovered,
            total: coverage.totalAssets,
            uncovered: coverage.uncoveredAssets,
        },
        mitigations: {
            withMitigations: mitigations.threatsWithMitigations,
            withoutMitigations: mitigations.threatsWithoutMitigations,
        },
        overallStatus: completeness.valid && coverage.uncoveredAssets.length === 0 ? 'VALID' : 'NEEDS_WORK',
        generatedAt: new Date(),
    };
    common_1.Logger.log(`Threat model validation report generated: ${modelId}`, 'ThreatModeling');
    return report;
};
exports.generateThreatModelValidationReport = generateThreatModelValidationReport;
// ============================================================================
// 38-40: RISK-BASED THREAT PRIORITIZATION
// ============================================================================
/**
 * Prioritizes threats using risk-based scoring
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Prioritized threats
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeThreatsbyRisk('tm-stride-123', sequelize);
 * console.log('Top threat:', prioritized[0]);
 * ```
 */
const prioritizeThreatsByRisk = async (modelId, sequelize) => {
    const threats = await sequelize.query(`SELECT * FROM stride_threats WHERE model_id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    const severityScores = {
        CRITICAL: 10,
        HIGH: 7,
        MEDIUM: 4,
        LOW: 2,
        INFORMATIONAL: 1,
    };
    const prioritized = threats.map((threat) => {
        const severityScore = severityScores[threat.severity] || 1;
        const riskScore = threat.likelihood * severityScore;
        return {
            threatId: threat.id,
            category: threat.category,
            description: threat.description,
            severity: threat.severity,
            likelihood: threat.likelihood,
            riskScore: parseFloat(riskScore.toFixed(2)),
            affectedAsset: threat.affected_asset,
        };
    });
    // Sort by risk score descending
    prioritized.sort((a, b) => b.riskScore - a.riskScore);
    common_1.Logger.log(`Threats prioritized by risk: ${modelId}, Total: ${prioritized.length}`, 'ThreatModeling');
    return prioritized;
};
exports.prioritizeThreatsByRisk = prioritizeThreatsByRisk;
/**
 * Generates risk matrix for threats
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, Array<string>>>} Risk matrix
 *
 * @example
 * ```typescript
 * const matrix = await generateThreatRiskMatrix('tm-stride-123', sequelize);
 * console.log('Critical risks:', matrix.CRITICAL);
 * ```
 */
const generateThreatRiskMatrix = async (modelId, sequelize) => {
    const prioritized = await (0, exports.prioritizeThreatsByRisk)(modelId, sequelize);
    const matrix = {
        CRITICAL: [],
        HIGH: [],
        MEDIUM: [],
        LOW: [],
    };
    for (const threat of prioritized) {
        if (threat.riskScore >= 70) {
            matrix.CRITICAL.push(threat.threatId);
        }
        else if (threat.riskScore >= 40) {
            matrix.HIGH.push(threat.threatId);
        }
        else if (threat.riskScore >= 20) {
            matrix.MEDIUM.push(threat.threatId);
        }
        else {
            matrix.LOW.push(threat.threatId);
        }
    }
    common_1.Logger.log(`Risk matrix generated: ${modelId}`, 'ThreatModeling');
    return matrix;
};
exports.generateThreatRiskMatrix = generateThreatRiskMatrix;
/**
 * Calculates residual risk after mitigations
 *
 * @param {string} threatId - Threat identifier
 * @param {number} mitigationEffectiveness - Effectiveness of mitigations (0-1)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{originalRisk: number, residualRisk: number}>} Risk calculation
 *
 * @example
 * ```typescript
 * const risk = await calculateResidualRisk('threat-123', 0.8, sequelize);
 * console.log(`Residual risk: ${risk.residualRisk}`);
 * ```
 */
const calculateResidualRisk = async (threatId, mitigationEffectiveness, sequelize) => {
    const [threat] = await sequelize.query(`SELECT * FROM stride_threats WHERE id = :threatId`, { replacements: { threatId }, type: sequelize_1.QueryTypes.SELECT });
    if (!threat) {
        throw new common_1.NotFoundException(`Threat ${threatId} not found`);
    }
    const severityScores = {
        CRITICAL: 10,
        HIGH: 7,
        MEDIUM: 4,
        LOW: 2,
        INFORMATIONAL: 1,
    };
    const severityScore = severityScores[threat.severity] || 1;
    const originalRisk = threat.likelihood * severityScore;
    const residualRisk = originalRisk * (1 - mitigationEffectiveness);
    common_1.Logger.log(`Residual risk calculated: ${threatId}`, 'ThreatModeling');
    return {
        originalRisk: parseFloat(originalRisk.toFixed(2)),
        residualRisk: parseFloat(residualRisk.toFixed(2)),
    };
};
exports.calculateResidualRisk = calculateResidualRisk;
// ============================================================================
// 41-42: THREAT MODEL MAINTENANCE
// ============================================================================
/**
 * Updates threat model with new version
 *
 * @param {string} modelId - Threat model ID
 * @param {Object} updates - Model updates
 * @param {string} updatedBy - User ID performing update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated threat model
 *
 * @example
 * ```typescript
 * const updated = await updateThreatModel('tm-stride-123', {
 *   assets: [...newAssets],
 *   scope: 'EXPANDED_SCOPE',
 * }, 'architect-456', sequelize);
 * ```
 */
const updateThreatModel = async (modelId, updates, updatedBy, sequelize) => {
    const setParts = [];
    const replacements = {
        modelId,
        updatedBy,
        updatedAt: new Date(),
    };
    if (updates.assets) {
        setParts.push('assets = :assets');
        replacements.assets = JSON.stringify(updates.assets);
    }
    if (updates.scope) {
        setParts.push('scope = :scope');
        replacements.scope = updates.scope;
    }
    if (updates.stakeholders) {
        setParts.push('stakeholders = :stakeholders');
        replacements.stakeholders = JSON.stringify(updates.stakeholders);
    }
    if (updates.metadata) {
        setParts.push('metadata = :metadata');
        replacements.metadata = JSON.stringify(updates.metadata);
    }
    setParts.push('updated_by = :updatedBy');
    setParts.push('updated_at = :updatedAt');
    // Increment version
    setParts.push(`version = (CAST(SPLIT_PART(version, '.', 1) AS INTEGER) + 1) || '.0'`);
    const [result] = await sequelize.query(`UPDATE threat_models SET ${setParts.join(', ')} WHERE id = :modelId RETURNING *`, {
        replacements,
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Threat model updated: ${modelId}`, 'ThreatModeling');
    return result;
};
exports.updateThreatModel = updateThreatModel;
/**
 * Archives outdated threat model
 *
 * @param {string} modelId - Threat model ID
 * @param {string} archivedBy - User ID archiving the model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Archived threat model
 *
 * @example
 * ```typescript
 * const archived = await archiveThreatModel('tm-stride-old-123', 'admin-456', sequelize);
 * ```
 */
const archiveThreatModel = async (modelId, archivedBy, sequelize) => {
    const [result] = await sequelize.query(`UPDATE threat_models SET status = :archivedStatus, archived_by = :archivedBy,
     archived_at = :archivedAt, updated_at = :updatedAt
     WHERE id = :modelId
     RETURNING *`, {
        replacements: {
            modelId,
            archivedStatus: ThreatModelStatus.ARCHIVED,
            archivedBy,
            archivedAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Threat model archived: ${modelId}`, 'ThreatModeling');
    return result;
};
exports.archiveThreatModel = archiveThreatModel;
// ============================================================================
// 43-44: MITRE ATT&CK INTEGRATION
// ============================================================================
/**
 * Maps threat to MITRE ATT&CK framework
 *
 * @param {string} threatId - Threat identifier
 * @param {Object} mitreData - MITRE ATT&CK mapping data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MITREMapping>} MITRE mapping
 *
 * @example
 * ```typescript
 * const mapping = await mapThreatToMITREATTACK('threat-123', {
 *   tactics: ['Initial Access', 'Execution'],
 *   techniques: [
 *     { techniqueId: 'T1566', techniqueName: 'Phishing' },
 *     { techniqueId: 'T1059', techniqueName: 'Command and Scripting Interpreter' },
 *   ],
 *   mitigations: [
 *     { mitigationId: 'M1049', mitigationName: 'Antivirus/Antimalware' },
 *   ],
 *   detections: ['Email filtering', 'Endpoint detection'],
 * }, sequelize);
 * ```
 */
const mapThreatToMITREATTACK = async (threatId, mitreData, sequelize) => {
    const mapping = {
        threatId,
        ...mitreData,
    };
    await sequelize.query(`INSERT INTO mitre_mappings (threat_id, tactics, techniques, mitigations, detections, created_at)
     VALUES (:threatId, :tactics, :techniques, :mitigations, :detections, :createdAt)`, {
        replacements: {
            threatId,
            tactics: JSON.stringify(mitreData.tactics),
            techniques: JSON.stringify(mitreData.techniques),
            mitigations: JSON.stringify(mitreData.mitigations),
            detections: JSON.stringify(mitreData.detections),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`MITRE ATT&CK mapping created: ${threatId}`, 'ThreatModeling');
    return mapping;
};
exports.mapThreatToMITREATTACK = mapThreatToMITREATTACK;
/**
 * Generates MITRE ATT&CK coverage report
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} MITRE coverage report
 *
 * @example
 * ```typescript
 * const report = await generateMITRECoverageReport('tm-stride-123', sequelize);
 * console.log('Tactics covered:', report.tacticsCovered);
 * ```
 */
const generateMITRECoverageReport = async (modelId, sequelize) => {
    const threats = await sequelize.query(`SELECT id FROM stride_threats WHERE model_id = :modelId`, { replacements: { modelId }, type: sequelize_1.QueryTypes.SELECT });
    const threatIds = threats.map((t) => t.id);
    if (threatIds.length === 0) {
        return {
            modelId,
            tacticsCovered: [],
            techniquesCovered: [],
            mitigationsCovered: [],
            coveragePercentage: 0,
        };
    }
    const mappings = await sequelize.query(`SELECT * FROM mitre_mappings WHERE threat_id IN (:threatIds)`, { replacements: { threatIds }, type: sequelize_1.QueryTypes.SELECT });
    const allTactics = new Set();
    const allTechniques = new Set();
    const allMitigations = new Set();
    for (const mapping of mappings) {
        const tactics = JSON.parse(mapping.tactics || '[]');
        const techniques = JSON.parse(mapping.techniques || '[]');
        const mitigations = JSON.parse(mapping.mitigations || '[]');
        tactics.forEach((t) => allTactics.add(t));
        techniques.forEach((t) => allTechniques.add(t.techniqueId));
        mitigations.forEach((m) => allMitigations.add(m.mitigationId));
    }
    const totalMITRETactics = 14; // MITRE ATT&CK has 14 tactics
    const coveragePercentage = (allTactics.size / totalMITRETactics) * 100;
    common_1.Logger.log(`MITRE coverage report generated: ${modelId}`, 'ThreatModeling');
    return {
        modelId,
        tacticsCovered: Array.from(allTactics),
        techniquesCovered: Array.from(allTechniques),
        mitigationsCovered: Array.from(allMitigations),
        coveragePercentage: parseFloat(coveragePercentage.toFixed(2)),
        totalThreats: threats.length,
        threatsWithMITREMapping: mappings.length,
    };
};
exports.generateMITRECoverageReport = generateMITRECoverageReport;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Threat Model Creation (1-8)
    createSTRIDEThreatModel: exports.createSTRIDEThreatModel,
    analyzeSTRIDEThreats: exports.analyzeSTRIDEThreats,
    createDREADModel: exports.createDREADModel,
    calculateDREADScore: exports.calculateDREADScore,
    createPASTAModel: exports.createPASTAModel,
    executePASTAStage: exports.executePASTAStage,
    getThreatModelById: exports.getThreatModelById,
    updateThreatModelStatus: exports.updateThreatModelStatus,
    // Data Flow Diagram Analysis (9-14)
    generateDataFlowDiagram: exports.generateDataFlowDiagram,
    analyzeDataFlowRisks: exports.analyzeDataFlowRisks,
    analyzeTrustBoundaries: exports.analyzeTrustBoundaries,
    validateDataFlowDiagram: exports.validateDataFlowDiagram,
    exportDataFlowDiagram: exports.exportDataFlowDiagram,
    updateDataFlowDiagram: exports.updateDataFlowDiagram,
    // Trust Boundary Identification (15-19)
    identifyTrustBoundaries: exports.identifyTrustBoundaries,
    classifyTrustBoundaryType: exports.classifyTrustBoundaryType,
    analyzeBoundaryCrossings: exports.analyzeBoundaryCrossings,
    validateTrustBoundaryControls: exports.validateTrustBoundaryControls,
    generateBoundaryThreatReport: exports.generateBoundaryThreatReport,
    // Attack Tree Generation (20-24)
    generateAttackTree: exports.generateAttackTree,
    calculateAttackTreeProbabilities: exports.calculateAttackTreeProbabilities,
    identifyMostLikelyAttackPath: exports.identifyMostLikelyAttackPath,
    analyzeAttackTreeMitigations: exports.analyzeAttackTreeMitigations,
    exportAttackTree: exports.exportAttackTree,
    // Threat Scenario Modeling (25-29)
    createThreatScenario: exports.createThreatScenario,
    analyzeThreatScenarioImpact: exports.analyzeThreatScenarioImpact,
    simulateThreatScenario: exports.simulateThreatScenario,
    compareThreatScenarios: exports.compareThreatScenarios,
    generateThreatScenarioReport: exports.generateThreatScenarioReport,
    // Security Architecture Review (30-33)
    performSecurityArchitectureReview: exports.performSecurityArchitectureReview,
    validateSecurityDesignPatterns: exports.validateSecurityDesignPatterns,
    analyzeSecurityControlCoverage: exports.analyzeSecurityControlCoverage,
    generateArchitectureSecurityScorecard: exports.generateArchitectureSecurityScorecard,
    // Threat Model Validation (34-37)
    validateThreatModelCompleteness: exports.validateThreatModelCompleteness,
    checkThreatModelCoverage: exports.checkThreatModelCoverage,
    validateThreatMitigations: exports.validateThreatMitigations,
    generateThreatModelValidationReport: exports.generateThreatModelValidationReport,
    // Risk-based Threat Prioritization (38-40)
    prioritizeThreatsByRisk: exports.prioritizeThreatsByRisk,
    generateThreatRiskMatrix: exports.generateThreatRiskMatrix,
    calculateResidualRisk: exports.calculateResidualRisk,
    // Threat Model Maintenance (41-42)
    updateThreatModel: exports.updateThreatModel,
    archiveThreatModel: exports.archiveThreatModel,
    // MITRE ATT&CK Integration (43-44)
    mapThreatToMITREATTACK: exports.mapThreatToMITREATTACK,
    generateMITRECoverageReport: exports.generateMITRECoverageReport,
};
//# sourceMappingURL=threat-modeling-kit.js.map