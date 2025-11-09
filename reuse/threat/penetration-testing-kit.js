"use strict";
/**
 * LOC: THREATPENTEST89012
 * File: /reuse/threat/penetration-testing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Security testing services
 *   - Vulnerability management controllers
 *   - Red team exercise modules
 *   - Security reporting services
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
exports.PenetrationTestingService = exports.RemediationTask = exports.RedTeamExercise = exports.Vulnerability = exports.PenetrationTest = exports.PurpleTeamActivityDto = exports.CreateRemediationTaskDto = exports.CreateRedTeamExerciseDto = exports.CreateVulnerabilityDto = exports.CreatePenTestDto = exports.RemediationStatus = exports.RedTeamObjective = exports.AttackVector = exports.ExploitComplexity = exports.VulnerabilityStatus = exports.VulnerabilitySeverity = exports.PenTestPhase = exports.PenTestScope = exports.PenTestType = exports.PenTestMethodology = void 0;
exports.initPenetrationTestModel = initPenetrationTestModel;
exports.initVulnerabilityModel = initVulnerabilityModel;
exports.initRedTeamExerciseModel = initRedTeamExerciseModel;
exports.initRemediationTaskModel = initRemediationTaskModel;
exports.createPenetrationTest = createPenetrationTest;
exports.updatePenTestPhase = updatePenTestPhase;
exports.calculateScopeMetrics = calculateScopeMetrics;
exports.generateScopeDocument = generateScopeDocument;
exports.calculateCVSSScore = calculateCVSSScore;
exports.createVulnerability = createVulnerability;
exports.updateVulnerabilityStatus = updateVulnerabilityStatus;
exports.updatePenTestStatistics = updatePenTestStatistics;
exports.trackExploitationAttempt = trackExploitationAttempt;
exports.getVulnerabilitiesBySeverity = getVulnerabilitiesBySeverity;
exports.generateExecutiveSummary = generateExecutiveSummary;
exports.generateVulnerabilityReport = generateVulnerabilityReport;
exports.calculateRemediationTimeline = calculateRemediationTimeline;
exports.mapToOWASPTop10 = mapToOWASPTop10;
exports.createRemediationTask = createRemediationTask;
exports.updateRemediationStatus = updateRemediationStatus;
exports.verifyRemediation = verifyRemediation;
exports.getOverdueRemediationTasks = getOverdueRemediationTasks;
exports.calculateRemediationProgress = calculateRemediationProgress;
exports.createRedTeamExercise = createRedTeamExercise;
exports.updateRedTeamObjective = updateRedTeamObjective;
exports.trackSystemCompromise = trackSystemCompromise;
exports.calculateRedTeamMetrics = calculateRedTeamMetrics;
exports.schedulePurpleTeamActivity = schedulePurpleTeamActivity;
exports.recordPurpleTeamResults = recordPurpleTeamResults;
exports.generatePurpleTeamReport = generatePurpleTeamReport;
exports.calculatePenTestCoverage = calculatePenTestCoverage;
exports.calculateMTTR = calculateMTTR;
exports.generateSecurityTestingKPIs = generateSecurityTestingKPIs;
exports.analyzeVulnerabilityTrends = analyzeVulnerabilityTrends;
/**
 * File: /reuse/threat/penetration-testing-kit.ts
 * Locator: WC-THREAT-PENTEST-001
 * Purpose: Enterprise Penetration Testing & Red Team Operations - OWASP, PTES, NIST 800-115 compliant
 *
 * Upstream: Independent penetration testing utility module
 * Downstream: ../backend/*, Security testing controllers, Red team services, Vulnerability management, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 46+ utility functions for pen test planning, vulnerability tracking, exploitation management, remediation verification, red team exercises
 *
 * LLM Context: Enterprise-grade penetration testing framework compliant with PTES, OWASP Testing Guide, NIST 800-115.
 * Provides comprehensive pen test planning and scoping, vulnerability discovery and exploitation tracking, penetration test report generation,
 * remediation tracking and verification, red team exercise management, purple team coordination, security testing metrics and KPIs,
 * attack simulation frameworks, threat modeling integration, vulnerability scoring (CVSS), exploit database integration,
 * security testing automation, compliance validation testing, web application testing (OWASP Top 10), network penetration testing,
 * social engineering campaigns, physical security testing, wireless security assessment, and integrated security testing workflows.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
var PenTestMethodology;
(function (PenTestMethodology) {
    PenTestMethodology["PTES"] = "ptes";
    PenTestMethodology["OWASP"] = "owasp";
    PenTestMethodology["NIST_800_115"] = "nist-800-115";
    PenTestMethodology["OSSTMM"] = "osstmm";
    PenTestMethodology["ISSAF"] = "issaf";
    PenTestMethodology["CUSTOM"] = "custom";
})(PenTestMethodology || (exports.PenTestMethodology = PenTestMethodology = {}));
var PenTestType;
(function (PenTestType) {
    PenTestType["BLACK_BOX"] = "black-box";
    PenTestType["GRAY_BOX"] = "gray-box";
    PenTestType["WHITE_BOX"] = "white-box";
    PenTestType["RED_TEAM"] = "red-team";
    PenTestType["PURPLE_TEAM"] = "purple-team";
    PenTestType["BUG_BOUNTY"] = "bug-bounty";
})(PenTestType || (exports.PenTestType = PenTestType = {}));
var PenTestScope;
(function (PenTestScope) {
    PenTestScope["WEB_APPLICATION"] = "web-application";
    PenTestScope["MOBILE_APPLICATION"] = "mobile-application";
    PenTestScope["NETWORK_INFRASTRUCTURE"] = "network-infrastructure";
    PenTestScope["WIRELESS"] = "wireless";
    PenTestScope["SOCIAL_ENGINEERING"] = "social-engineering";
    PenTestScope["PHYSICAL_SECURITY"] = "physical-security";
    PenTestScope["CLOUD_INFRASTRUCTURE"] = "cloud-infrastructure";
    PenTestScope["API"] = "api";
    PenTestScope["IOT"] = "iot";
})(PenTestScope || (exports.PenTestScope = PenTestScope = {}));
var PenTestPhase;
(function (PenTestPhase) {
    PenTestPhase["PRE_ENGAGEMENT"] = "pre-engagement";
    PenTestPhase["INTELLIGENCE_GATHERING"] = "intelligence-gathering";
    PenTestPhase["THREAT_MODELING"] = "threat-modeling";
    PenTestPhase["VULNERABILITY_ANALYSIS"] = "vulnerability-analysis";
    PenTestPhase["EXPLOITATION"] = "exploitation";
    PenTestPhase["POST_EXPLOITATION"] = "post-exploitation";
    PenTestPhase["REPORTING"] = "reporting";
    PenTestPhase["REMEDIATION_VERIFICATION"] = "remediation-verification";
})(PenTestPhase || (exports.PenTestPhase = PenTestPhase = {}));
var VulnerabilitySeverity;
(function (VulnerabilitySeverity) {
    VulnerabilitySeverity["CRITICAL"] = "critical";
    VulnerabilitySeverity["HIGH"] = "high";
    VulnerabilitySeverity["MEDIUM"] = "medium";
    VulnerabilitySeverity["LOW"] = "low";
    VulnerabilitySeverity["INFORMATIONAL"] = "informational";
})(VulnerabilitySeverity || (exports.VulnerabilitySeverity = VulnerabilitySeverity = {}));
var VulnerabilityStatus;
(function (VulnerabilityStatus) {
    VulnerabilityStatus["DISCOVERED"] = "discovered";
    VulnerabilityStatus["EXPLOITED"] = "exploited";
    VulnerabilityStatus["REPORTED"] = "reported";
    VulnerabilityStatus["REMEDIATION_IN_PROGRESS"] = "remediation-in-progress";
    VulnerabilityStatus["REMEDIATED"] = "remediated";
    VulnerabilityStatus["VERIFIED"] = "verified";
    VulnerabilityStatus["ACCEPTED"] = "accepted";
    VulnerabilityStatus["FALSE_POSITIVE"] = "false-positive";
})(VulnerabilityStatus || (exports.VulnerabilityStatus = VulnerabilityStatus = {}));
var ExploitComplexity;
(function (ExploitComplexity) {
    ExploitComplexity["LOW"] = "low";
    ExploitComplexity["MEDIUM"] = "medium";
    ExploitComplexity["HIGH"] = "high";
})(ExploitComplexity || (exports.ExploitComplexity = ExploitComplexity = {}));
var AttackVector;
(function (AttackVector) {
    AttackVector["NETWORK"] = "network";
    AttackVector["ADJACENT_NETWORK"] = "adjacent-network";
    AttackVector["LOCAL"] = "local";
    AttackVector["PHYSICAL"] = "physical";
})(AttackVector || (exports.AttackVector = AttackVector = {}));
var RedTeamObjective;
(function (RedTeamObjective) {
    RedTeamObjective["DATA_EXFILTRATION"] = "data-exfiltration";
    RedTeamObjective["PRIVILEGE_ESCALATION"] = "privilege-escalation";
    RedTeamObjective["LATERAL_MOVEMENT"] = "lateral-movement";
    RedTeamObjective["PERSISTENCE"] = "persistence";
    RedTeamObjective["CREDENTIAL_HARVESTING"] = "credential-harvesting";
    RedTeamObjective["DENIAL_OF_SERVICE"] = "denial-of-service";
    RedTeamObjective["INFRASTRUCTURE_COMPROMISE"] = "infrastructure-compromise";
})(RedTeamObjective || (exports.RedTeamObjective = RedTeamObjective = {}));
var RemediationStatus;
(function (RemediationStatus) {
    RemediationStatus["NOT_STARTED"] = "not-started";
    RemediationStatus["IN_PROGRESS"] = "in-progress";
    RemediationStatus["COMPLETED"] = "completed";
    RemediationStatus["VERIFIED"] = "verified";
    RemediationStatus["FAILED_VERIFICATION"] = "failed-verification";
    RemediationStatus["DEFERRED"] = "deferred";
})(RemediationStatus || (exports.RemediationStatus = RemediationStatus = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreatePenTestDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _scopes_decorators;
    let _scopes_initializers = [];
    let _scopes_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _targetUrls_decorators;
    let _targetUrls_initializers = [];
    let _targetUrls_extraInitializers = [];
    let _targetNetworks_decorators;
    let _targetNetworks_initializers = [];
    let _targetNetworks_extraInitializers = [];
    let _teamMembers_decorators;
    let _teamMembers_initializers = [];
    let _teamMembers_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePenTestDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.methodology = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
                this.type = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.scopes = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
                this.startDate = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.targetUrls = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _targetUrls_initializers, void 0));
                this.targetNetworks = (__runInitializers(this, _targetUrls_extraInitializers), __runInitializers(this, _targetNetworks_initializers, void 0));
                this.teamMembers = (__runInitializers(this, _targetNetworks_extraInitializers), __runInitializers(this, _teamMembers_initializers, void 0));
                this.metadata = (__runInitializers(this, _teamMembers_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Q1 2025 Web Application Security Assessment' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Comprehensive security testing of patient portal' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(2000)];
            _methodology_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestMethodology }), (0, class_validator_1.IsEnum)(PenTestMethodology)];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestType }), (0, class_validator_1.IsEnum)(PenTestType)];
            _scopes_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestScope, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(PenTestScope, { each: true })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-01-15T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-02-15T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _targetUrls_decorators = [(0, swagger_1.ApiProperty)({ example: ['https://patient-portal.example.com'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUrl)({}, { each: true })];
            _targetNetworks_decorators = [(0, swagger_1.ApiProperty)({ example: ['10.0.0.0/24'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _teamMembers_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Doe, Jane Smith' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { customerContact: 'security@example.com' } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: obj => "scopes" in obj, get: obj => obj.scopes, set: (obj, value) => { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _targetUrls_decorators, { kind: "field", name: "targetUrls", static: false, private: false, access: { has: obj => "targetUrls" in obj, get: obj => obj.targetUrls, set: (obj, value) => { obj.targetUrls = value; } }, metadata: _metadata }, _targetUrls_initializers, _targetUrls_extraInitializers);
            __esDecorate(null, null, _targetNetworks_decorators, { kind: "field", name: "targetNetworks", static: false, private: false, access: { has: obj => "targetNetworks" in obj, get: obj => obj.targetNetworks, set: (obj, value) => { obj.targetNetworks = value; } }, metadata: _metadata }, _targetNetworks_initializers, _targetNetworks_extraInitializers);
            __esDecorate(null, null, _teamMembers_decorators, { kind: "field", name: "teamMembers", static: false, private: false, access: { has: obj => "teamMembers" in obj, get: obj => obj.teamMembers, set: (obj, value) => { obj.teamMembers = value; } }, metadata: _metadata }, _teamMembers_initializers, _teamMembers_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePenTestDto = CreatePenTestDto;
let CreateVulnerabilityDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _cvssScore_decorators;
    let _cvssScore_initializers = [];
    let _cvssScore_extraInitializers = [];
    let _cvssVector_decorators;
    let _cvssVector_initializers = [];
    let _cvssVector_extraInitializers = [];
    let _cweId_decorators;
    let _cweId_initializers = [];
    let _cweId_extraInitializers = [];
    let _attackVector_decorators;
    let _attackVector_initializers = [];
    let _attackVector_extraInitializers = [];
    let _exploitComplexity_decorators;
    let _exploitComplexity_initializers = [];
    let _exploitComplexity_extraInitializers = [];
    let _affectedUrl_decorators;
    let _affectedUrl_initializers = [];
    let _affectedUrl_extraInitializers = [];
    let _proofOfConcept_decorators;
    let _proofOfConcept_initializers = [];
    let _proofOfConcept_extraInitializers = [];
    let _remediation_decorators;
    let _remediation_initializers = [];
    let _remediation_extraInitializers = [];
    return _a = class CreateVulnerabilityDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.cvssScore = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _cvssScore_initializers, void 0));
                this.cvssVector = (__runInitializers(this, _cvssScore_extraInitializers), __runInitializers(this, _cvssVector_initializers, void 0));
                this.cweId = (__runInitializers(this, _cvssVector_extraInitializers), __runInitializers(this, _cweId_initializers, void 0));
                this.attackVector = (__runInitializers(this, _cweId_extraInitializers), __runInitializers(this, _attackVector_initializers, void 0));
                this.exploitComplexity = (__runInitializers(this, _attackVector_extraInitializers), __runInitializers(this, _exploitComplexity_initializers, void 0));
                this.affectedUrl = (__runInitializers(this, _exploitComplexity_extraInitializers), __runInitializers(this, _affectedUrl_initializers, void 0));
                this.proofOfConcept = (__runInitializers(this, _affectedUrl_extraInitializers), __runInitializers(this, _proofOfConcept_initializers, void 0));
                this.remediation = (__runInitializers(this, _proofOfConcept_extraInitializers), __runInitializers(this, _remediation_initializers, void 0));
                __runInitializers(this, _remediation_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'SQL Injection in login form' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'User input not properly sanitized in username field' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(5000)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: VulnerabilitySeverity }), (0, class_validator_1.IsEnum)(VulnerabilitySeverity)];
            _cvssScore_decorators = [(0, swagger_1.ApiProperty)({ example: 9.8 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(10)];
            _cvssVector_decorators = [(0, swagger_1.ApiProperty)({ example: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cweId_decorators = [(0, swagger_1.ApiProperty)({ example: 'CWE-89' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _attackVector_decorators = [(0, swagger_1.ApiProperty)({ enum: AttackVector }), (0, class_validator_1.IsEnum)(AttackVector)];
            _exploitComplexity_decorators = [(0, swagger_1.ApiProperty)({ enum: ExploitComplexity }), (0, class_validator_1.IsEnum)(ExploitComplexity)];
            _affectedUrl_decorators = [(0, swagger_1.ApiProperty)({ example: 'https://patient-portal.example.com/login' }), (0, class_validator_1.IsUrl)(), (0, class_validator_1.IsOptional)()];
            _proofOfConcept_decorators = [(0, swagger_1.ApiProperty)({ example: { parameter: 'username', payload: "' OR 1=1--" } }), (0, class_validator_1.IsOptional)()];
            _remediation_decorators = [(0, swagger_1.ApiProperty)({ example: 'Implement parameterized queries' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(2000)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _cvssScore_decorators, { kind: "field", name: "cvssScore", static: false, private: false, access: { has: obj => "cvssScore" in obj, get: obj => obj.cvssScore, set: (obj, value) => { obj.cvssScore = value; } }, metadata: _metadata }, _cvssScore_initializers, _cvssScore_extraInitializers);
            __esDecorate(null, null, _cvssVector_decorators, { kind: "field", name: "cvssVector", static: false, private: false, access: { has: obj => "cvssVector" in obj, get: obj => obj.cvssVector, set: (obj, value) => { obj.cvssVector = value; } }, metadata: _metadata }, _cvssVector_initializers, _cvssVector_extraInitializers);
            __esDecorate(null, null, _cweId_decorators, { kind: "field", name: "cweId", static: false, private: false, access: { has: obj => "cweId" in obj, get: obj => obj.cweId, set: (obj, value) => { obj.cweId = value; } }, metadata: _metadata }, _cweId_initializers, _cweId_extraInitializers);
            __esDecorate(null, null, _attackVector_decorators, { kind: "field", name: "attackVector", static: false, private: false, access: { has: obj => "attackVector" in obj, get: obj => obj.attackVector, set: (obj, value) => { obj.attackVector = value; } }, metadata: _metadata }, _attackVector_initializers, _attackVector_extraInitializers);
            __esDecorate(null, null, _exploitComplexity_decorators, { kind: "field", name: "exploitComplexity", static: false, private: false, access: { has: obj => "exploitComplexity" in obj, get: obj => obj.exploitComplexity, set: (obj, value) => { obj.exploitComplexity = value; } }, metadata: _metadata }, _exploitComplexity_initializers, _exploitComplexity_extraInitializers);
            __esDecorate(null, null, _affectedUrl_decorators, { kind: "field", name: "affectedUrl", static: false, private: false, access: { has: obj => "affectedUrl" in obj, get: obj => obj.affectedUrl, set: (obj, value) => { obj.affectedUrl = value; } }, metadata: _metadata }, _affectedUrl_initializers, _affectedUrl_extraInitializers);
            __esDecorate(null, null, _proofOfConcept_decorators, { kind: "field", name: "proofOfConcept", static: false, private: false, access: { has: obj => "proofOfConcept" in obj, get: obj => obj.proofOfConcept, set: (obj, value) => { obj.proofOfConcept = value; } }, metadata: _metadata }, _proofOfConcept_initializers, _proofOfConcept_extraInitializers);
            __esDecorate(null, null, _remediation_decorators, { kind: "field", name: "remediation", static: false, private: false, access: { has: obj => "remediation" in obj, get: obj => obj.remediation, set: (obj, value) => { obj.remediation = value; } }, metadata: _metadata }, _remediation_initializers, _remediation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVulnerabilityDto = CreateVulnerabilityDto;
let CreateRedTeamExerciseDto = (() => {
    var _a;
    let _codeName_decorators;
    let _codeName_initializers = [];
    let _codeName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _targetSystems_decorators;
    let _targetSystems_initializers = [];
    let _targetSystems_extraInitializers = [];
    let _blueTeamNotified_decorators;
    let _blueTeamNotified_initializers = [];
    let _blueTeamNotified_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateRedTeamExerciseDto {
            constructor() {
                this.codeName = __runInitializers(this, _codeName_initializers, void 0);
                this.description = (__runInitializers(this, _codeName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.objectives = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.startDate = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.targetSystems = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _targetSystems_initializers, void 0));
                this.blueTeamNotified = (__runInitializers(this, _targetSystems_extraInitializers), __runInitializers(this, _blueTeamNotified_initializers, void 0));
                this.metadata = (__runInitializers(this, _blueTeamNotified_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _codeName_decorators = [(0, swagger_1.ApiProperty)({ example: 'Operation Silent Storm' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Test detection and response capabilities' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ enum: RedTeamObjective, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(RedTeamObjective, { each: true })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-03-01T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-03-15T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _targetSystems_decorators = [(0, swagger_1.ApiProperty)({ example: ['patient-portal', 'admin-dashboard'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _blueTeamNotified_decorators = [(0, swagger_1.ApiProperty)({ example: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { ttps: ['T1190', 'T1059'], mitre_attack: true } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _codeName_decorators, { kind: "field", name: "codeName", static: false, private: false, access: { has: obj => "codeName" in obj, get: obj => obj.codeName, set: (obj, value) => { obj.codeName = value; } }, metadata: _metadata }, _codeName_initializers, _codeName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _targetSystems_decorators, { kind: "field", name: "targetSystems", static: false, private: false, access: { has: obj => "targetSystems" in obj, get: obj => obj.targetSystems, set: (obj, value) => { obj.targetSystems = value; } }, metadata: _metadata }, _targetSystems_initializers, _targetSystems_extraInitializers);
            __esDecorate(null, null, _blueTeamNotified_decorators, { kind: "field", name: "blueTeamNotified", static: false, private: false, access: { has: obj => "blueTeamNotified" in obj, get: obj => obj.blueTeamNotified, set: (obj, value) => { obj.blueTeamNotified = value; } }, metadata: _metadata }, _blueTeamNotified_initializers, _blueTeamNotified_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRedTeamExerciseDto = CreateRedTeamExerciseDto;
let CreateRemediationTaskDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateRemediationTaskDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.priority = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.metadata = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Fix SQL Injection in login form' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Implement prepared statements for all database queries' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ example: 'backend-team' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-02-01T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: VulnerabilitySeverity }), (0, class_validator_1.IsEnum)(VulnerabilitySeverity)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { estimatedHours: 8, jiraTicket: 'SEC-123' } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRemediationTaskDto = CreateRemediationTaskDto;
let PurpleTeamActivityDto = (() => {
    var _a;
    let _activity_decorators;
    let _activity_initializers = [];
    let _activity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _scheduledTime_decorators;
    let _scheduledTime_initializers = [];
    let _scheduledTime_extraInitializers = [];
    let _participants_decorators;
    let _participants_initializers = [];
    let _participants_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class PurpleTeamActivityDto {
            constructor() {
                this.activity = __runInitializers(this, _activity_initializers, void 0);
                this.description = (__runInitializers(this, _activity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.scheduledTime = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scheduledTime_initializers, void 0));
                this.participants = (__runInitializers(this, _scheduledTime_extraInitializers), __runInitializers(this, _participants_initializers, void 0));
                this.metadata = (__runInitializers(this, _participants_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _activity_decorators = [(0, swagger_1.ApiProperty)({ example: 'Detect SQL injection attempts' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Red team performs SQL injection, Blue team monitors WAF logs' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _scheduledTime_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-01-20T10:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _participants_decorators = [(0, swagger_1.ApiProperty)({ example: 'John (Red), Jane (Blue)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { detectionRule: 'WAF-001', expectedAlert: true } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _activity_decorators, { kind: "field", name: "activity", static: false, private: false, access: { has: obj => "activity" in obj, get: obj => obj.activity, set: (obj, value) => { obj.activity = value; } }, metadata: _metadata }, _activity_initializers, _activity_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _scheduledTime_decorators, { kind: "field", name: "scheduledTime", static: false, private: false, access: { has: obj => "scheduledTime" in obj, get: obj => obj.scheduledTime, set: (obj, value) => { obj.scheduledTime = value; } }, metadata: _metadata }, _scheduledTime_initializers, _scheduledTime_extraInitializers);
            __esDecorate(null, null, _participants_decorators, { kind: "field", name: "participants", static: false, private: false, access: { has: obj => "participants" in obj, get: obj => obj.participants, set: (obj, value) => { obj.participants = value; } }, metadata: _metadata }, _participants_initializers, _participants_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PurpleTeamActivityDto = PurpleTeamActivityDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let PenetrationTest = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _scopes_decorators;
    let _scopes_initializers = [];
    let _scopes_extraInitializers = [];
    let _currentPhase_decorators;
    let _currentPhase_initializers = [];
    let _currentPhase_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _targetUrls_decorators;
    let _targetUrls_initializers = [];
    let _targetUrls_extraInitializers = [];
    let _targetNetworks_decorators;
    let _targetNetworks_initializers = [];
    let _targetNetworks_extraInitializers = [];
    let _teamMembers_decorators;
    let _teamMembers_initializers = [];
    let _teamMembers_extraInitializers = [];
    let _findingsCount_decorators;
    let _findingsCount_initializers = [];
    let _findingsCount_extraInitializers = [];
    let _criticalFindings_decorators;
    let _criticalFindings_initializers = [];
    let _criticalFindings_extraInitializers = [];
    let _highFindings_decorators;
    let _highFindings_initializers = [];
    let _highFindings_extraInitializers = [];
    let _mediumFindings_decorators;
    let _mediumFindings_initializers = [];
    let _mediumFindings_extraInitializers = [];
    let _lowFindings_decorators;
    let _lowFindings_initializers = [];
    let _lowFindings_extraInitializers = [];
    let _reportUrl_decorators;
    let _reportUrl_initializers = [];
    let _reportUrl_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    return _a = class PenetrationTest extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.methodology = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
                this.type = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.scopes = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
                this.currentPhase = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _currentPhase_initializers, void 0));
                this.startDate = (__runInitializers(this, _currentPhase_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.targetUrls = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _targetUrls_initializers, void 0));
                this.targetNetworks = (__runInitializers(this, _targetUrls_extraInitializers), __runInitializers(this, _targetNetworks_initializers, void 0));
                this.teamMembers = (__runInitializers(this, _targetNetworks_extraInitializers), __runInitializers(this, _teamMembers_initializers, void 0));
                this.findingsCount = (__runInitializers(this, _teamMembers_extraInitializers), __runInitializers(this, _findingsCount_initializers, void 0));
                this.criticalFindings = (__runInitializers(this, _findingsCount_extraInitializers), __runInitializers(this, _criticalFindings_initializers, void 0));
                this.highFindings = (__runInitializers(this, _criticalFindings_extraInitializers), __runInitializers(this, _highFindings_initializers, void 0));
                this.mediumFindings = (__runInitializers(this, _highFindings_extraInitializers), __runInitializers(this, _mediumFindings_initializers, void 0));
                this.lowFindings = (__runInitializers(this, _mediumFindings_extraInitializers), __runInitializers(this, _lowFindings_initializers, void 0));
                this.reportUrl = (__runInitializers(this, _lowFindings_extraInitializers), __runInitializers(this, _reportUrl_initializers, void 0));
                this.metadata = (__runInitializers(this, _reportUrl_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.completedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
                __runInitializers(this, _completedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _methodology_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestMethodology })];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestType })];
            _scopes_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestScope, isArray: true })];
            _currentPhase_decorators = [(0, swagger_1.ApiProperty)({ enum: PenTestPhase })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)()];
            _targetUrls_decorators = [(0, swagger_1.ApiProperty)()];
            _targetNetworks_decorators = [(0, swagger_1.ApiProperty)()];
            _teamMembers_decorators = [(0, swagger_1.ApiProperty)()];
            _findingsCount_decorators = [(0, swagger_1.ApiProperty)()];
            _criticalFindings_decorators = [(0, swagger_1.ApiProperty)()];
            _highFindings_decorators = [(0, swagger_1.ApiProperty)()];
            _mediumFindings_decorators = [(0, swagger_1.ApiProperty)()];
            _lowFindings_decorators = [(0, swagger_1.ApiProperty)()];
            _reportUrl_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _completedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: obj => "scopes" in obj, get: obj => obj.scopes, set: (obj, value) => { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _currentPhase_decorators, { kind: "field", name: "currentPhase", static: false, private: false, access: { has: obj => "currentPhase" in obj, get: obj => obj.currentPhase, set: (obj, value) => { obj.currentPhase = value; } }, metadata: _metadata }, _currentPhase_initializers, _currentPhase_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _targetUrls_decorators, { kind: "field", name: "targetUrls", static: false, private: false, access: { has: obj => "targetUrls" in obj, get: obj => obj.targetUrls, set: (obj, value) => { obj.targetUrls = value; } }, metadata: _metadata }, _targetUrls_initializers, _targetUrls_extraInitializers);
            __esDecorate(null, null, _targetNetworks_decorators, { kind: "field", name: "targetNetworks", static: false, private: false, access: { has: obj => "targetNetworks" in obj, get: obj => obj.targetNetworks, set: (obj, value) => { obj.targetNetworks = value; } }, metadata: _metadata }, _targetNetworks_initializers, _targetNetworks_extraInitializers);
            __esDecorate(null, null, _teamMembers_decorators, { kind: "field", name: "teamMembers", static: false, private: false, access: { has: obj => "teamMembers" in obj, get: obj => obj.teamMembers, set: (obj, value) => { obj.teamMembers = value; } }, metadata: _metadata }, _teamMembers_initializers, _teamMembers_extraInitializers);
            __esDecorate(null, null, _findingsCount_decorators, { kind: "field", name: "findingsCount", static: false, private: false, access: { has: obj => "findingsCount" in obj, get: obj => obj.findingsCount, set: (obj, value) => { obj.findingsCount = value; } }, metadata: _metadata }, _findingsCount_initializers, _findingsCount_extraInitializers);
            __esDecorate(null, null, _criticalFindings_decorators, { kind: "field", name: "criticalFindings", static: false, private: false, access: { has: obj => "criticalFindings" in obj, get: obj => obj.criticalFindings, set: (obj, value) => { obj.criticalFindings = value; } }, metadata: _metadata }, _criticalFindings_initializers, _criticalFindings_extraInitializers);
            __esDecorate(null, null, _highFindings_decorators, { kind: "field", name: "highFindings", static: false, private: false, access: { has: obj => "highFindings" in obj, get: obj => obj.highFindings, set: (obj, value) => { obj.highFindings = value; } }, metadata: _metadata }, _highFindings_initializers, _highFindings_extraInitializers);
            __esDecorate(null, null, _mediumFindings_decorators, { kind: "field", name: "mediumFindings", static: false, private: false, access: { has: obj => "mediumFindings" in obj, get: obj => obj.mediumFindings, set: (obj, value) => { obj.mediumFindings = value; } }, metadata: _metadata }, _mediumFindings_initializers, _mediumFindings_extraInitializers);
            __esDecorate(null, null, _lowFindings_decorators, { kind: "field", name: "lowFindings", static: false, private: false, access: { has: obj => "lowFindings" in obj, get: obj => obj.lowFindings, set: (obj, value) => { obj.lowFindings = value; } }, metadata: _metadata }, _lowFindings_initializers, _lowFindings_extraInitializers);
            __esDecorate(null, null, _reportUrl_decorators, { kind: "field", name: "reportUrl", static: false, private: false, access: { has: obj => "reportUrl" in obj, get: obj => obj.reportUrl, set: (obj, value) => { obj.reportUrl = value; } }, metadata: _metadata }, _reportUrl_initializers, _reportUrl_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PenetrationTest = PenetrationTest;
let Vulnerability = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _penTestId_decorators;
    let _penTestId_initializers = [];
    let _penTestId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _cvssScore_decorators;
    let _cvssScore_initializers = [];
    let _cvssScore_extraInitializers = [];
    let _cvssVector_decorators;
    let _cvssVector_initializers = [];
    let _cvssVector_extraInitializers = [];
    let _cweId_decorators;
    let _cweId_initializers = [];
    let _cweId_extraInitializers = [];
    let _attackVector_decorators;
    let _attackVector_initializers = [];
    let _attackVector_extraInitializers = [];
    let _exploitComplexity_decorators;
    let _exploitComplexity_initializers = [];
    let _exploitComplexity_extraInitializers = [];
    let _affectedUrl_decorators;
    let _affectedUrl_initializers = [];
    let _affectedUrl_extraInitializers = [];
    let _proofOfConcept_decorators;
    let _proofOfConcept_initializers = [];
    let _proofOfConcept_extraInitializers = [];
    let _remediation_decorators;
    let _remediation_initializers = [];
    let _remediation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _discoveredAt_decorators;
    let _discoveredAt_initializers = [];
    let _discoveredAt_extraInitializers = [];
    let _reportedAt_decorators;
    let _reportedAt_initializers = [];
    let _reportedAt_extraInitializers = [];
    let _remediatedAt_decorators;
    let _remediatedAt_initializers = [];
    let _remediatedAt_extraInitializers = [];
    let _verifiedAt_decorators;
    let _verifiedAt_initializers = [];
    let _verifiedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class Vulnerability extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.penTestId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _penTestId_initializers, void 0));
                this.title = (__runInitializers(this, _penTestId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.cvssScore = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _cvssScore_initializers, void 0));
                this.cvssVector = (__runInitializers(this, _cvssScore_extraInitializers), __runInitializers(this, _cvssVector_initializers, void 0));
                this.cweId = (__runInitializers(this, _cvssVector_extraInitializers), __runInitializers(this, _cweId_initializers, void 0));
                this.attackVector = (__runInitializers(this, _cweId_extraInitializers), __runInitializers(this, _attackVector_initializers, void 0));
                this.exploitComplexity = (__runInitializers(this, _attackVector_extraInitializers), __runInitializers(this, _exploitComplexity_initializers, void 0));
                this.affectedUrl = (__runInitializers(this, _exploitComplexity_extraInitializers), __runInitializers(this, _affectedUrl_initializers, void 0));
                this.proofOfConcept = (__runInitializers(this, _affectedUrl_extraInitializers), __runInitializers(this, _proofOfConcept_initializers, void 0));
                this.remediation = (__runInitializers(this, _proofOfConcept_extraInitializers), __runInitializers(this, _remediation_initializers, void 0));
                this.status = (__runInitializers(this, _remediation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.discoveredAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _discoveredAt_initializers, void 0));
                this.reportedAt = (__runInitializers(this, _discoveredAt_extraInitializers), __runInitializers(this, _reportedAt_initializers, void 0));
                this.remediatedAt = (__runInitializers(this, _reportedAt_extraInitializers), __runInitializers(this, _remediatedAt_initializers, void 0));
                this.verifiedAt = (__runInitializers(this, _remediatedAt_extraInitializers), __runInitializers(this, _verifiedAt_initializers, void 0));
                this.metadata = (__runInitializers(this, _verifiedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _penTestId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: VulnerabilitySeverity })];
            _cvssScore_decorators = [(0, swagger_1.ApiProperty)()];
            _cvssVector_decorators = [(0, swagger_1.ApiProperty)()];
            _cweId_decorators = [(0, swagger_1.ApiProperty)()];
            _attackVector_decorators = [(0, swagger_1.ApiProperty)({ enum: AttackVector })];
            _exploitComplexity_decorators = [(0, swagger_1.ApiProperty)({ enum: ExploitComplexity })];
            _affectedUrl_decorators = [(0, swagger_1.ApiProperty)()];
            _proofOfConcept_decorators = [(0, swagger_1.ApiProperty)()];
            _remediation_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: VulnerabilityStatus })];
            _discoveredAt_decorators = [(0, swagger_1.ApiProperty)()];
            _reportedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _remediatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _verifiedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _penTestId_decorators, { kind: "field", name: "penTestId", static: false, private: false, access: { has: obj => "penTestId" in obj, get: obj => obj.penTestId, set: (obj, value) => { obj.penTestId = value; } }, metadata: _metadata }, _penTestId_initializers, _penTestId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _cvssScore_decorators, { kind: "field", name: "cvssScore", static: false, private: false, access: { has: obj => "cvssScore" in obj, get: obj => obj.cvssScore, set: (obj, value) => { obj.cvssScore = value; } }, metadata: _metadata }, _cvssScore_initializers, _cvssScore_extraInitializers);
            __esDecorate(null, null, _cvssVector_decorators, { kind: "field", name: "cvssVector", static: false, private: false, access: { has: obj => "cvssVector" in obj, get: obj => obj.cvssVector, set: (obj, value) => { obj.cvssVector = value; } }, metadata: _metadata }, _cvssVector_initializers, _cvssVector_extraInitializers);
            __esDecorate(null, null, _cweId_decorators, { kind: "field", name: "cweId", static: false, private: false, access: { has: obj => "cweId" in obj, get: obj => obj.cweId, set: (obj, value) => { obj.cweId = value; } }, metadata: _metadata }, _cweId_initializers, _cweId_extraInitializers);
            __esDecorate(null, null, _attackVector_decorators, { kind: "field", name: "attackVector", static: false, private: false, access: { has: obj => "attackVector" in obj, get: obj => obj.attackVector, set: (obj, value) => { obj.attackVector = value; } }, metadata: _metadata }, _attackVector_initializers, _attackVector_extraInitializers);
            __esDecorate(null, null, _exploitComplexity_decorators, { kind: "field", name: "exploitComplexity", static: false, private: false, access: { has: obj => "exploitComplexity" in obj, get: obj => obj.exploitComplexity, set: (obj, value) => { obj.exploitComplexity = value; } }, metadata: _metadata }, _exploitComplexity_initializers, _exploitComplexity_extraInitializers);
            __esDecorate(null, null, _affectedUrl_decorators, { kind: "field", name: "affectedUrl", static: false, private: false, access: { has: obj => "affectedUrl" in obj, get: obj => obj.affectedUrl, set: (obj, value) => { obj.affectedUrl = value; } }, metadata: _metadata }, _affectedUrl_initializers, _affectedUrl_extraInitializers);
            __esDecorate(null, null, _proofOfConcept_decorators, { kind: "field", name: "proofOfConcept", static: false, private: false, access: { has: obj => "proofOfConcept" in obj, get: obj => obj.proofOfConcept, set: (obj, value) => { obj.proofOfConcept = value; } }, metadata: _metadata }, _proofOfConcept_initializers, _proofOfConcept_extraInitializers);
            __esDecorate(null, null, _remediation_decorators, { kind: "field", name: "remediation", static: false, private: false, access: { has: obj => "remediation" in obj, get: obj => obj.remediation, set: (obj, value) => { obj.remediation = value; } }, metadata: _metadata }, _remediation_initializers, _remediation_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _discoveredAt_decorators, { kind: "field", name: "discoveredAt", static: false, private: false, access: { has: obj => "discoveredAt" in obj, get: obj => obj.discoveredAt, set: (obj, value) => { obj.discoveredAt = value; } }, metadata: _metadata }, _discoveredAt_initializers, _discoveredAt_extraInitializers);
            __esDecorate(null, null, _reportedAt_decorators, { kind: "field", name: "reportedAt", static: false, private: false, access: { has: obj => "reportedAt" in obj, get: obj => obj.reportedAt, set: (obj, value) => { obj.reportedAt = value; } }, metadata: _metadata }, _reportedAt_initializers, _reportedAt_extraInitializers);
            __esDecorate(null, null, _remediatedAt_decorators, { kind: "field", name: "remediatedAt", static: false, private: false, access: { has: obj => "remediatedAt" in obj, get: obj => obj.remediatedAt, set: (obj, value) => { obj.remediatedAt = value; } }, metadata: _metadata }, _remediatedAt_initializers, _remediatedAt_extraInitializers);
            __esDecorate(null, null, _verifiedAt_decorators, { kind: "field", name: "verifiedAt", static: false, private: false, access: { has: obj => "verifiedAt" in obj, get: obj => obj.verifiedAt, set: (obj, value) => { obj.verifiedAt = value; } }, metadata: _metadata }, _verifiedAt_initializers, _verifiedAt_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.Vulnerability = Vulnerability;
let RedTeamExercise = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _codeName_decorators;
    let _codeName_initializers = [];
    let _codeName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _targetSystems_decorators;
    let _targetSystems_initializers = [];
    let _targetSystems_extraInitializers = [];
    let _blueTeamNotified_decorators;
    let _blueTeamNotified_initializers = [];
    let _blueTeamNotified_extraInitializers = [];
    let _objectivesAchieved_decorators;
    let _objectivesAchieved_initializers = [];
    let _objectivesAchieved_extraInitializers = [];
    let _detectionRate_decorators;
    let _detectionRate_initializers = [];
    let _detectionRate_extraInitializers = [];
    let _meanTimeToDetect_decorators;
    let _meanTimeToDetect_initializers = [];
    let _meanTimeToDetect_extraInitializers = [];
    let _compromisedSystems_decorators;
    let _compromisedSystems_initializers = [];
    let _compromisedSystems_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    return _a = class RedTeamExercise extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.codeName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _codeName_initializers, void 0));
                this.description = (__runInitializers(this, _codeName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.objectives = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.startDate = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.targetSystems = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _targetSystems_initializers, void 0));
                this.blueTeamNotified = (__runInitializers(this, _targetSystems_extraInitializers), __runInitializers(this, _blueTeamNotified_initializers, void 0));
                this.objectivesAchieved = (__runInitializers(this, _blueTeamNotified_extraInitializers), __runInitializers(this, _objectivesAchieved_initializers, void 0));
                this.detectionRate = (__runInitializers(this, _objectivesAchieved_extraInitializers), __runInitializers(this, _detectionRate_initializers, void 0));
                this.meanTimeToDetect = (__runInitializers(this, _detectionRate_extraInitializers), __runInitializers(this, _meanTimeToDetect_initializers, void 0));
                this.compromisedSystems = (__runInitializers(this, _meanTimeToDetect_extraInitializers), __runInitializers(this, _compromisedSystems_initializers, void 0));
                this.metadata = (__runInitializers(this, _compromisedSystems_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.completedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
                __runInitializers(this, _completedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _codeName_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ enum: RedTeamObjective, isArray: true })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)()];
            _targetSystems_decorators = [(0, swagger_1.ApiProperty)()];
            _blueTeamNotified_decorators = [(0, swagger_1.ApiProperty)()];
            _objectivesAchieved_decorators = [(0, swagger_1.ApiProperty)()];
            _detectionRate_decorators = [(0, swagger_1.ApiProperty)()];
            _meanTimeToDetect_decorators = [(0, swagger_1.ApiProperty)()];
            _compromisedSystems_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _completedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _codeName_decorators, { kind: "field", name: "codeName", static: false, private: false, access: { has: obj => "codeName" in obj, get: obj => obj.codeName, set: (obj, value) => { obj.codeName = value; } }, metadata: _metadata }, _codeName_initializers, _codeName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _targetSystems_decorators, { kind: "field", name: "targetSystems", static: false, private: false, access: { has: obj => "targetSystems" in obj, get: obj => obj.targetSystems, set: (obj, value) => { obj.targetSystems = value; } }, metadata: _metadata }, _targetSystems_initializers, _targetSystems_extraInitializers);
            __esDecorate(null, null, _blueTeamNotified_decorators, { kind: "field", name: "blueTeamNotified", static: false, private: false, access: { has: obj => "blueTeamNotified" in obj, get: obj => obj.blueTeamNotified, set: (obj, value) => { obj.blueTeamNotified = value; } }, metadata: _metadata }, _blueTeamNotified_initializers, _blueTeamNotified_extraInitializers);
            __esDecorate(null, null, _objectivesAchieved_decorators, { kind: "field", name: "objectivesAchieved", static: false, private: false, access: { has: obj => "objectivesAchieved" in obj, get: obj => obj.objectivesAchieved, set: (obj, value) => { obj.objectivesAchieved = value; } }, metadata: _metadata }, _objectivesAchieved_initializers, _objectivesAchieved_extraInitializers);
            __esDecorate(null, null, _detectionRate_decorators, { kind: "field", name: "detectionRate", static: false, private: false, access: { has: obj => "detectionRate" in obj, get: obj => obj.detectionRate, set: (obj, value) => { obj.detectionRate = value; } }, metadata: _metadata }, _detectionRate_initializers, _detectionRate_extraInitializers);
            __esDecorate(null, null, _meanTimeToDetect_decorators, { kind: "field", name: "meanTimeToDetect", static: false, private: false, access: { has: obj => "meanTimeToDetect" in obj, get: obj => obj.meanTimeToDetect, set: (obj, value) => { obj.meanTimeToDetect = value; } }, metadata: _metadata }, _meanTimeToDetect_initializers, _meanTimeToDetect_extraInitializers);
            __esDecorate(null, null, _compromisedSystems_decorators, { kind: "field", name: "compromisedSystems", static: false, private: false, access: { has: obj => "compromisedSystems" in obj, get: obj => obj.compromisedSystems, set: (obj, value) => { obj.compromisedSystems = value; } }, metadata: _metadata }, _compromisedSystems_initializers, _compromisedSystems_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RedTeamExercise = RedTeamExercise;
let RemediationTask = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vulnerabilityId_decorators;
    let _vulnerabilityId_initializers = [];
    let _vulnerabilityId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _verificationNotes_decorators;
    let _verificationNotes_initializers = [];
    let _verificationNotes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class RemediationTask extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.vulnerabilityId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vulnerabilityId_initializers, void 0));
                this.title = (__runInitializers(this, _vulnerabilityId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.priority = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.completedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
                this.verificationNotes = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _verificationNotes_initializers, void 0));
                this.metadata = (__runInitializers(this, _verificationNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _vulnerabilityId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)()];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: VulnerabilitySeverity })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: RemediationStatus })];
            _completedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _verificationNotes_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _vulnerabilityId_decorators, { kind: "field", name: "vulnerabilityId", static: false, private: false, access: { has: obj => "vulnerabilityId" in obj, get: obj => obj.vulnerabilityId, set: (obj, value) => { obj.vulnerabilityId = value; } }, metadata: _metadata }, _vulnerabilityId_initializers, _vulnerabilityId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
            __esDecorate(null, null, _verificationNotes_decorators, { kind: "field", name: "verificationNotes", static: false, private: false, access: { has: obj => "verificationNotes" in obj, get: obj => obj.verificationNotes, set: (obj, value) => { obj.verificationNotes = value; } }, metadata: _metadata }, _verificationNotes_initializers, _verificationNotes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RemediationTask = RemediationTask;
// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================
/**
 * Initialize Penetration Test model
 * @param sequelize Sequelize instance
 * @returns PenetrationTest model
 */
function initPenetrationTestModel(sequelize) {
    PenetrationTest.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        methodology: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PenTestMethodology)),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PenTestType)),
            allowNull: false,
        },
        scopes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        currentPhase: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PenTestPhase)),
            allowNull: false,
            defaultValue: PenTestPhase.PRE_ENGAGEMENT,
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        targetUrls: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        targetNetworks: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        teamMembers: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        findingsCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        criticalFindings: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        highFindings: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        mediumFindings: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        lowFindings: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        reportUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'penetration_tests',
        timestamps: true,
        indexes: [
            { fields: ['methodology'] },
            { fields: ['type'] },
            { fields: ['currentPhase'] },
            { fields: ['startDate', 'endDate'] },
        ],
    });
    return PenetrationTest;
}
/**
 * Initialize Vulnerability model
 * @param sequelize Sequelize instance
 * @returns Vulnerability model
 */
function initVulnerabilityModel(sequelize) {
    Vulnerability.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        penTestId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'penetration_tests',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(VulnerabilitySeverity)),
            allowNull: false,
        },
        cvssScore: {
            type: sequelize_1.DataTypes.DECIMAL(3, 1),
            allowNull: false,
        },
        cvssVector: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        cweId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        attackVector: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AttackVector)),
            allowNull: false,
        },
        exploitComplexity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ExploitComplexity)),
            allowNull: false,
        },
        affectedUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
        },
        proofOfConcept: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        remediation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(VulnerabilityStatus)),
            allowNull: false,
            defaultValue: VulnerabilityStatus.DISCOVERED,
        },
        discoveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        reportedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        remediatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        verifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'vulnerabilities',
        timestamps: true,
        indexes: [
            { fields: ['penTestId'] },
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['cvssScore'] },
            { fields: ['discoveredAt'] },
        ],
    });
    return Vulnerability;
}
/**
 * Initialize Red Team Exercise model
 * @param sequelize Sequelize instance
 * @returns RedTeamExercise model
 */
function initRedTeamExerciseModel(sequelize) {
    RedTeamExercise.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        codeName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        objectives: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        targetSystems: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        blueTeamNotified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        objectivesAchieved: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        detectionRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        meanTimeToDetect: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Mean time to detect in minutes',
        },
        compromisedSystems: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'red_team_exercises',
        timestamps: true,
        indexes: [
            { fields: ['codeName'], unique: true },
            { fields: ['startDate', 'endDate'] },
            { fields: ['blueTeamNotified'] },
        ],
    });
    return RedTeamExercise;
}
/**
 * Initialize Remediation Task model
 * @param sequelize Sequelize instance
 * @returns RemediationTask model
 */
function initRemediationTaskModel(sequelize) {
    RemediationTask.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        vulnerabilityId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'vulnerabilities',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(VulnerabilitySeverity)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(RemediationStatus)),
            allowNull: false,
            defaultValue: RemediationStatus.NOT_STARTED,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        verificationNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'remediation_tasks',
        timestamps: true,
        indexes: [
            { fields: ['vulnerabilityId'] },
            { fields: ['assignedTo'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['dueDate'] },
        ],
    });
    return RemediationTask;
}
// ============================================================================
// PENETRATION TEST PLANNING AND SCOPING FUNCTIONS
// ============================================================================
/**
 * Create a new penetration test
 * @param data Pen test data
 * @param transaction Optional transaction
 * @returns Created penetration test
 */
async function createPenetrationTest(data, transaction) {
    return await PenetrationTest.create({
        ...data,
        currentPhase: PenTestPhase.PRE_ENGAGEMENT,
        findingsCount: 0,
        criticalFindings: 0,
        highFindings: 0,
        mediumFindings: 0,
        lowFindings: 0,
    }, { transaction });
}
/**
 * Update penetration test phase
 * @param penTestId Penetration test ID
 * @param phase New phase
 * @param transaction Optional transaction
 * @returns Updated penetration test
 */
async function updatePenTestPhase(penTestId, phase, transaction) {
    const penTest = await PenetrationTest.findByPk(penTestId, { transaction });
    if (!penTest) {
        throw new Error(`Penetration test ${penTestId} not found`);
    }
    penTest.currentPhase = phase;
    if (phase === PenTestPhase.REPORTING) {
        penTest.completedAt = new Date();
    }
    await penTest.save({ transaction });
    return penTest;
}
/**
 * Calculate penetration test scope metrics
 * @param penTest Penetration test
 * @returns Scope metrics
 */
function calculateScopeMetrics(penTest) {
    const targetCount = penTest.targetUrls.length + (penTest.targetNetworks?.length || 0);
    const scopeCount = penTest.scopes.length;
    // Estimate duration based on scope and type
    const baseHours = {
        [PenTestType.BLACK_BOX]: 40,
        [PenTestType.GRAY_BOX]: 60,
        [PenTestType.WHITE_BOX]: 80,
        [PenTestType.RED_TEAM]: 120,
        [PenTestType.PURPLE_TEAM]: 100,
        [PenTestType.BUG_BOUNTY]: 0,
    };
    const scopeMultiplier = {
        [PenTestScope.WEB_APPLICATION]: 1.0,
        [PenTestScope.MOBILE_APPLICATION]: 1.2,
        [PenTestScope.NETWORK_INFRASTRUCTURE]: 1.5,
        [PenTestScope.WIRELESS]: 1.3,
        [PenTestScope.SOCIAL_ENGINEERING]: 1.1,
        [PenTestScope.PHYSICAL_SECURITY]: 1.4,
        [PenTestScope.CLOUD_INFRASTRUCTURE]: 1.6,
        [PenTestScope.API]: 0.8,
        [PenTestScope.IOT]: 1.7,
    };
    const totalMultiplier = penTest.scopes.reduce((sum, scope) => sum + scopeMultiplier[scope], 0);
    const estimatedDuration = baseHours[penTest.type] * totalMultiplier * (targetCount / 5 + 1);
    const complexityScore = Math.min(10, (scopeCount * 2 + targetCount / 2) / 2);
    return {
        targetCount,
        scopeCount,
        estimatedDuration: Math.round(estimatedDuration),
        complexityScore: Math.round(complexityScore * 10) / 10,
    };
}
/**
 * Generate penetration test scope document
 * @param penTest Penetration test
 * @returns Scope document
 */
function generateScopeDocument(penTest) {
    const metrics = calculateScopeMetrics(penTest);
    return {
        overview: `${penTest.type} penetration test using ${penTest.methodology} methodology covering ${metrics.scopeCount} scope areas with ${metrics.targetCount} targets.`,
        objectives: [
            'Identify security vulnerabilities in target systems',
            'Assess the effectiveness of security controls',
            'Validate compliance with security standards',
            'Provide actionable remediation recommendations',
        ],
        inScope: [
            ...penTest.targetUrls.map(url => `Web target: ${url}`),
            ...(penTest.targetNetworks || []).map(net => `Network target: ${net}`),
            ...penTest.scopes.map(scope => `Scope: ${scope}`),
        ],
        outOfScope: [
            'Production database modifications',
            'Denial of service attacks',
            'Social engineering of executive staff (unless approved)',
            'Physical damage to equipment',
        ],
        assumptions: [
            'Testing will occur within specified time window',
            'Access credentials will be provided as specified',
            'Point of contact will be available during testing',
            'Emergency contact procedures are established',
        ],
        constraints: [
            'No testing outside business hours without approval',
            'Rate limiting must be respected',
            'Data exfiltration limited to proof of concept',
            'All findings must be reported within 24 hours',
        ],
    };
}
/**
 * Calculate CVSS base score from components
 * @param attackVector Attack vector
 * @param attackComplexity Attack complexity
 * @param privilegesRequired Privileges required
 * @param userInteraction User interaction required
 * @param scope Scope change
 * @param confidentialityImpact Confidentiality impact
 * @param integrityImpact Integrity impact
 * @param availabilityImpact Availability impact
 * @returns CVSS base score
 */
function calculateCVSSScore(params) {
    const avMap = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
    const acMap = { L: 0.77, H: 0.44 };
    const prMap = { N: 0.85, L: 0.62, H: 0.27 };
    const uiMap = { N: 0.85, R: 0.62 };
    const impactMap = { N: 0, L: 0.22, H: 0.56 };
    const av = avMap[params.attackVector];
    const ac = acMap[params.attackComplexity];
    const pr = prMap[params.privilegesRequired];
    const ui = uiMap[params.userInteraction];
    const c = impactMap[params.confidentialityImpact];
    const i = impactMap[params.integrityImpact];
    const a = impactMap[params.availabilityImpact];
    const iss = 1 - (1 - c) * (1 - i) * (1 - a);
    const impact = params.scope === 'C' ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;
    if (impact <= 0)
        return 0;
    const exploitability = 8.22 * av * ac * pr * ui;
    const baseScore = params.scope === 'C'
        ? Math.min(1.08 * (impact + exploitability), 10)
        : Math.min(impact + exploitability, 10);
    return Math.round(baseScore * 10) / 10;
}
// ============================================================================
// VULNERABILITY EXPLOITATION TRACKING FUNCTIONS
// ============================================================================
/**
 * Create a new vulnerability
 * @param data Vulnerability data
 * @param transaction Optional transaction
 * @returns Created vulnerability
 */
async function createVulnerability(data, transaction) {
    const vulnerability = await Vulnerability.create({
        ...data,
        status: VulnerabilityStatus.DISCOVERED,
        discoveredAt: new Date(),
    }, { transaction });
    // Update pen test statistics
    await updatePenTestStatistics(data.penTestId, transaction);
    return vulnerability;
}
/**
 * Update vulnerability status
 * @param vulnerabilityId Vulnerability ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
async function updateVulnerabilityStatus(vulnerabilityId, status, transaction) {
    const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
    if (!vulnerability) {
        throw new Error(`Vulnerability ${vulnerabilityId} not found`);
    }
    vulnerability.status = status;
    if (status === VulnerabilityStatus.REPORTED && !vulnerability.reportedAt) {
        vulnerability.reportedAt = new Date();
    }
    else if (status === VulnerabilityStatus.REMEDIATED && !vulnerability.remediatedAt) {
        vulnerability.remediatedAt = new Date();
    }
    else if (status === VulnerabilityStatus.VERIFIED && !vulnerability.verifiedAt) {
        vulnerability.verifiedAt = new Date();
    }
    await vulnerability.save({ transaction });
    return vulnerability;
}
/**
 * Update pen test statistics based on vulnerabilities
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 */
async function updatePenTestStatistics(penTestId, transaction) {
    const vulnerabilities = await Vulnerability.findAll({
        where: { penTestId },
        transaction,
    });
    const counts = {
        total: vulnerabilities.length,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
    };
    for (const vuln of vulnerabilities) {
        if (vuln.severity === VulnerabilitySeverity.CRITICAL)
            counts.critical++;
        else if (vuln.severity === VulnerabilitySeverity.HIGH)
            counts.high++;
        else if (vuln.severity === VulnerabilitySeverity.MEDIUM)
            counts.medium++;
        else if (vuln.severity === VulnerabilitySeverity.LOW)
            counts.low++;
    }
    await PenetrationTest.update({
        findingsCount: counts.total,
        criticalFindings: counts.critical,
        highFindings: counts.high,
        mediumFindings: counts.medium,
        lowFindings: counts.low,
    }, {
        where: { id: penTestId },
        transaction,
    });
}
/**
 * Track vulnerability exploitation attempt
 * @param vulnerabilityId Vulnerability ID
 * @param success Whether exploitation was successful
 * @param notes Exploitation notes
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
async function trackExploitationAttempt(vulnerabilityId, success, notes, transaction) {
    const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
    if (!vulnerability) {
        throw new Error(`Vulnerability ${vulnerabilityId} not found`);
    }
    if (!vulnerability.metadata)
        vulnerability.metadata = {};
    if (!vulnerability.metadata.exploitationAttempts) {
        vulnerability.metadata.exploitationAttempts = [];
    }
    vulnerability.metadata.exploitationAttempts.push({
        timestamp: new Date().toISOString(),
        success,
        notes,
    });
    if (success) {
        vulnerability.status = VulnerabilityStatus.EXPLOITED;
    }
    await vulnerability.save({ transaction });
    return vulnerability;
}
/**
 * Get vulnerabilities by severity
 * @param penTestId Penetration test ID
 * @param severity Severity level
 * @param transaction Optional transaction
 * @returns Vulnerabilities
 */
async function getVulnerabilitiesBySeverity(penTestId, severity, transaction) {
    return await Vulnerability.findAll({
        where: {
            penTestId,
            severity,
        },
        order: [['cvssScore', 'DESC']],
        transaction,
    });
}
// ============================================================================
// PEN TEST REPORT GENERATION FUNCTIONS
// ============================================================================
/**
 * Generate executive summary for pen test report
 * @param penTest Penetration test
 * @param vulnerabilities Vulnerabilities found
 * @returns Executive summary
 */
function generateExecutiveSummary(penTest, vulnerabilities) {
    const criticalCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
    const highCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.HIGH).length;
    let riskLevel = 'Low';
    if (criticalCount > 0)
        riskLevel = 'Critical';
    else if (highCount > 2)
        riskLevel = 'High';
    else if (highCount > 0)
        riskLevel = 'Medium';
    return {
        overview: `This ${penTest.type} penetration test identified ${vulnerabilities.length} security vulnerabilities across ${penTest.scopes.length} scope areas.`,
        keyFindings: vulnerabilities
            .filter(v => [VulnerabilitySeverity.CRITICAL, VulnerabilitySeverity.HIGH].includes(v.severity))
            .slice(0, 5)
            .map(v => v.title),
        riskLevel,
        recommendations: [
            'Prioritize remediation of critical and high-severity vulnerabilities',
            'Implement security awareness training for development teams',
            'Establish regular security testing cadence',
            'Review and update security policies and procedures',
        ],
        statistics: {
            total: vulnerabilities.length,
            critical: criticalCount,
            high: highCount,
            medium: vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.MEDIUM).length,
            low: vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.LOW).length,
        },
    };
}
/**
 * Generate detailed vulnerability report
 * @param vulnerability Vulnerability
 * @returns Detailed report
 */
function generateVulnerabilityReport(vulnerability) {
    const impactMap = {
        [VulnerabilitySeverity.CRITICAL]: 'Complete system compromise possible. Immediate action required.',
        [VulnerabilitySeverity.HIGH]: 'Significant security risk. Remediation should be prioritized.',
        [VulnerabilitySeverity.MEDIUM]: 'Moderate security risk. Should be addressed in near term.',
        [VulnerabilitySeverity.LOW]: 'Low security risk. Can be addressed as part of routine maintenance.',
        [VulnerabilitySeverity.INFORMATIONAL]: 'Informational finding. No immediate action required.',
    };
    return {
        title: vulnerability.title,
        severity: vulnerability.severity,
        cvssScore: Number(vulnerability.cvssScore),
        description: vulnerability.description,
        impact: impactMap[vulnerability.severity],
        remediation: vulnerability.remediation || 'Contact security team for remediation guidance.',
        references: vulnerability.cweId ? [`CWE: ${vulnerability.cweId}`] : [],
    };
}
/**
 * Calculate remediation timeline
 * @param vulnerabilities Vulnerabilities
 * @returns Timeline by severity
 */
function calculateRemediationTimeline(vulnerabilities) {
    const slaMap = {
        [VulnerabilitySeverity.CRITICAL]: 7,
        [VulnerabilitySeverity.HIGH]: 30,
        [VulnerabilitySeverity.MEDIUM]: 90,
        [VulnerabilitySeverity.LOW]: 180,
        [VulnerabilitySeverity.INFORMATIONAL]: 365,
    };
    const timeline = {
        critical: slaMap[VulnerabilitySeverity.CRITICAL],
        high: slaMap[VulnerabilitySeverity.HIGH],
        medium: slaMap[VulnerabilitySeverity.MEDIUM],
        low: slaMap[VulnerabilitySeverity.LOW],
        totalDays: 0,
    };
    const maxSla = Math.max(...vulnerabilities.map(v => slaMap[v.severity] || 365));
    timeline.totalDays = maxSla;
    return timeline;
}
/**
 * Generate OWASP Top 10 mapping
 * @param vulnerabilities Vulnerabilities
 * @returns OWASP Top 10 mapping
 */
function mapToOWASPTop10(vulnerabilities) {
    const owaspMapping = new Map();
    const cweToOwasp = {
        'CWE-89': 'A03:2021-Injection',
        'CWE-79': 'A03:2021-Injection',
        'CWE-798': 'A07:2021-Identification and Authentication Failures',
        'CWE-287': 'A07:2021-Identification and Authentication Failures',
        'CWE-22': 'A01:2021-Broken Access Control',
        'CWE-352': 'A01:2021-Broken Access Control',
        'CWE-434': 'A04:2021-Insecure Design',
        'CWE-502': 'A08:2021-Software and Data Integrity Failures',
    };
    for (const vuln of vulnerabilities) {
        const owaspCategory = cweToOwasp[vuln.cweId || ''] || 'Uncategorized';
        if (!owaspMapping.has(owaspCategory)) {
            owaspMapping.set(owaspCategory, []);
        }
        owaspMapping.get(owaspCategory).push(vuln);
    }
    return owaspMapping;
}
// ============================================================================
// REMEDIATION VERIFICATION FUNCTIONS
// ============================================================================
/**
 * Create remediation task
 * @param data Remediation task data
 * @param transaction Optional transaction
 * @returns Created remediation task
 */
async function createRemediationTask(data, transaction) {
    return await RemediationTask.create({
        ...data,
        status: RemediationStatus.NOT_STARTED,
    }, { transaction });
}
/**
 * Update remediation task status
 * @param taskId Task ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated task
 */
async function updateRemediationStatus(taskId, status, transaction) {
    const task = await RemediationTask.findByPk(taskId, { transaction });
    if (!task) {
        throw new Error(`Remediation task ${taskId} not found`);
    }
    task.status = status;
    if (status === RemediationStatus.COMPLETED && !task.completedAt) {
        task.completedAt = new Date();
    }
    await task.save({ transaction });
    return task;
}
/**
 * Verify vulnerability remediation
 * @param vulnerabilityId Vulnerability ID
 * @param verificationNotes Verification notes
 * @param passed Whether verification passed
 * @param transaction Optional transaction
 * @returns Updated vulnerability and task
 */
async function verifyRemediation(vulnerabilityId, verificationNotes, passed, transaction) {
    const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
    if (!vulnerability) {
        throw new Error(`Vulnerability ${vulnerabilityId} not found`);
    }
    const task = await RemediationTask.findOne({
        where: { vulnerabilityId },
        transaction,
    });
    if (passed) {
        vulnerability.status = VulnerabilityStatus.VERIFIED;
        vulnerability.verifiedAt = new Date();
        if (task) {
            task.status = RemediationStatus.VERIFIED;
            task.verificationNotes = verificationNotes;
        }
    }
    else {
        if (task) {
            task.status = RemediationStatus.FAILED_VERIFICATION;
            task.verificationNotes = verificationNotes;
        }
    }
    await vulnerability.save({ transaction });
    if (task)
        await task.save({ transaction });
    return { vulnerability, task };
}
/**
 * Get overdue remediation tasks
 * @param transaction Optional transaction
 * @returns Overdue tasks
 */
async function getOverdueRemediationTasks(transaction) {
    return await RemediationTask.findAll({
        where: {
            status: {
                [sequelize_1.Op.notIn]: [RemediationStatus.COMPLETED, RemediationStatus.VERIFIED],
            },
            dueDate: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
        order: [
            ['priority', 'DESC'],
            ['dueDate', 'ASC'],
        ],
        transaction,
    });
}
/**
 * Calculate remediation progress
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 * @returns Remediation progress metrics
 */
async function calculateRemediationProgress(penTestId, transaction) {
    const vulnerabilities = await Vulnerability.findAll({
        where: { penTestId },
        transaction,
    });
    const total = vulnerabilities.length;
    const remediated = vulnerabilities.filter(v => v.status === VulnerabilityStatus.REMEDIATED).length;
    const verified = vulnerabilities.filter(v => v.status === VulnerabilityStatus.VERIFIED).length;
    const tasks = await RemediationTask.findAll({
        include: [
            {
                model: Vulnerability,
                where: { penTestId },
                required: true,
            },
        ],
        transaction,
    });
    const inProgress = tasks.filter(t => t.status === RemediationStatus.IN_PROGRESS).length;
    const notStarted = tasks.filter(t => t.status === RemediationStatus.NOT_STARTED).length;
    return {
        totalVulnerabilities: total,
        remediated,
        verified,
        inProgress,
        notStarted,
        percentComplete: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
}
// ============================================================================
// RED TEAM EXERCISE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create red team exercise
 * @param data Exercise data
 * @param transaction Optional transaction
 * @returns Created exercise
 */
async function createRedTeamExercise(data, transaction) {
    return await RedTeamExercise.create({
        ...data,
        objectivesAchieved: 0,
        compromisedSystems: [],
    }, { transaction });
}
/**
 * Update red team objective status
 * @param exerciseId Exercise ID
 * @param objectiveIndex Objective index
 * @param achieved Whether objective was achieved
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
async function updateRedTeamObjective(exerciseId, objectiveIndex, achieved, transaction) {
    const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
    if (!exercise) {
        throw new Error(`Red team exercise ${exerciseId} not found`);
    }
    if (!exercise.metadata)
        exercise.metadata = {};
    if (!exercise.metadata.objectiveStatus) {
        exercise.metadata.objectiveStatus = {};
    }
    exercise.metadata.objectiveStatus[objectiveIndex] = {
        achieved,
        timestamp: new Date().toISOString(),
    };
    exercise.objectivesAchieved = Object.values(exercise.metadata.objectiveStatus).filter((s) => s.achieved).length;
    await exercise.save({ transaction });
    return exercise;
}
/**
 * Track system compromise
 * @param exerciseId Exercise ID
 * @param systemName System name
 * @param timestamp Compromise timestamp
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
async function trackSystemCompromise(exerciseId, systemName, timestamp, transaction) {
    const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
    if (!exercise) {
        throw new Error(`Red team exercise ${exerciseId} not found`);
    }
    if (!exercise.compromisedSystems.includes(systemName)) {
        exercise.compromisedSystems.push(systemName);
    }
    if (!exercise.metadata)
        exercise.metadata = {};
    if (!exercise.metadata.compromiseTimeline) {
        exercise.metadata.compromiseTimeline = [];
    }
    exercise.metadata.compromiseTimeline.push({
        system: systemName,
        timestamp: timestamp.toISOString(),
    });
    await exercise.save({ transaction });
    return exercise;
}
/**
 * Calculate red team metrics
 * @param exercise Red team exercise
 * @returns Metrics
 */
function calculateRedTeamMetrics(exercise) {
    const objectiveSuccessRate = exercise.objectives.length > 0
        ? (exercise.objectivesAchieved / exercise.objectives.length) * 100
        : 0;
    const timeline = exercise.metadata?.compromiseTimeline || [];
    const avgTime = timeline.length > 0
        ? timeline.reduce((sum, item) => {
            const time = new Date(item.timestamp).getTime() - exercise.startDate.getTime();
            return sum + time;
        }, 0) / timeline.length / (1000 * 60 * 60)
        : 0;
    let effectiveness = 'Low';
    if (objectiveSuccessRate >= 80)
        effectiveness = 'High';
    else if (objectiveSuccessRate >= 50)
        effectiveness = 'Medium';
    return {
        objectiveSuccessRate: Math.round(objectiveSuccessRate),
        systemsCompromised: exercise.compromisedSystems.length,
        averageTimeToCompromise: Math.round(avgTime * 10) / 10,
        detectionRate: exercise.detectionRate ? Number(exercise.detectionRate) : 0,
        effectiveness,
    };
}
// ============================================================================
// PURPLE TEAM COORDINATION FUNCTIONS
// ============================================================================
/**
 * Schedule purple team activity
 * @param exerciseId Red team exercise ID
 * @param activity Activity details
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
async function schedulePurpleTeamActivity(exerciseId, activity, transaction) {
    const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
    if (!exercise) {
        throw new Error(`Red team exercise ${exerciseId} not found`);
    }
    if (!exercise.metadata)
        exercise.metadata = {};
    if (!exercise.metadata.purpleTeamActivities) {
        exercise.metadata.purpleTeamActivities = [];
    }
    exercise.metadata.purpleTeamActivities.push({
        ...activity,
        scheduledTime: activity.scheduledTime.toISOString(),
        status: 'scheduled',
    });
    await exercise.save({ transaction });
    return exercise;
}
/**
 * Record purple team activity results
 * @param exerciseId Exercise ID
 * @param activityIndex Activity index
 * @param detected Whether attack was detected
 * @param timeToDetect Time to detect in minutes
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
async function recordPurpleTeamResults(exerciseId, activityIndex, detected, timeToDetect, notes, transaction) {
    const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
    if (!exercise) {
        throw new Error(`Red team exercise ${exerciseId} not found`);
    }
    if (exercise.metadata?.purpleTeamActivities?.[activityIndex]) {
        exercise.metadata.purpleTeamActivities[activityIndex].status = 'completed';
        exercise.metadata.purpleTeamActivities[activityIndex].detected = detected;
        exercise.metadata.purpleTeamActivities[activityIndex].timeToDetect = timeToDetect;
        exercise.metadata.purpleTeamActivities[activityIndex].notes = notes;
    }
    // Recalculate detection metrics
    const activities = exercise.metadata?.purpleTeamActivities || [];
    const completed = activities.filter((a) => a.status === 'completed');
    const detectedCount = completed.filter((a) => a.detected).length;
    if (completed.length > 0) {
        exercise.detectionRate = (detectedCount / completed.length) * 100;
        const times = completed
            .filter((a) => a.detected && a.timeToDetect !== null)
            .map((a) => a.timeToDetect);
        if (times.length > 0) {
            exercise.meanTimeToDetect = times.reduce((sum, t) => sum + t, 0) / times.length;
        }
    }
    await exercise.save({ transaction });
    return exercise;
}
/**
 * Generate purple team collaboration report
 * @param exercise Red team exercise
 * @returns Collaboration report
 */
function generatePurpleTeamReport(exercise) {
    const activities = exercise.metadata?.purpleTeamActivities || [];
    const completed = activities.filter((a) => a.status === 'completed');
    const detected = completed.filter((a) => a.detected);
    return {
        overview: `Purple team exercise "${exercise.codeName}" with ${completed.length} completed activities.`,
        activitiesCompleted: completed.length,
        detectionRate: exercise.detectionRate ? Number(exercise.detectionRate) : 0,
        meanTimeToDetect: exercise.meanTimeToDetect || 0,
        improvements: [
            'Enhanced detection capabilities through collaborative testing',
            'Improved incident response procedures',
            'Updated security monitoring rules',
        ],
        gapsIdentified: detected.length < completed.length
            ? ['Some attack techniques went undetected', 'Detection time needs improvement']
            : [],
    };
}
// ============================================================================
// SECURITY TESTING METRICS FUNCTIONS
// ============================================================================
/**
 * Calculate penetration test coverage metrics
 * @param penTests Penetration tests
 * @returns Coverage metrics
 */
function calculatePenTestCoverage(penTests) {
    const scopesCovered = new Set();
    let totalFindings = 0;
    let totalCritical = 0;
    const testsByType = {};
    for (const test of penTests) {
        test.scopes.forEach(scope => scopesCovered.add(scope));
        totalFindings += test.findingsCount;
        totalCritical += test.criticalFindings;
        testsByType[test.type] = (testsByType[test.type] || 0) + 1;
    }
    return {
        totalTests: penTests.length,
        scopesCovered,
        averageFindingsPerTest: penTests.length > 0 ? totalFindings / penTests.length : 0,
        criticalFindingsRate: totalFindings > 0 ? (totalCritical / totalFindings) * 100 : 0,
        testsByType,
    };
}
/**
 * Calculate mean time to remediate (MTTR)
 * @param vulnerabilities Vulnerabilities
 * @returns MTTR in days
 */
function calculateMTTR(vulnerabilities) {
    const remediatedVulns = vulnerabilities.filter(v => v.remediatedAt && v.discoveredAt);
    if (remediatedVulns.length === 0)
        return 0;
    const totalTime = remediatedVulns.reduce((sum, v) => {
        const time = v.remediatedAt.getTime() - v.discoveredAt.getTime();
        return sum + time;
    }, 0);
    return totalTime / remediatedVulns.length / (1000 * 60 * 60 * 24);
}
/**
 * Generate security testing KPIs
 * @param penTests Penetration tests
 * @param vulnerabilities All vulnerabilities
 * @returns KPIs
 */
function generateSecurityTestingKPIs(penTests, vulnerabilities) {
    const mttr = calculateMTTR(vulnerabilities);
    const remediated = vulnerabilities.filter(v => v.status === VulnerabilityStatus.VERIFIED).length;
    const remediationRate = vulnerabilities.length > 0 ? (remediated / vulnerabilities.length) * 100 : 0;
    // Calculate test cadence (tests per quarter)
    const sortedTests = penTests.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    let testCadence = 0;
    if (sortedTests.length >= 2) {
        const timeSpan = sortedTests[sortedTests.length - 1].startDate.getTime() - sortedTests[0].startDate.getTime();
        const quarters = timeSpan / (1000 * 60 * 60 * 24 * 90);
        testCadence = quarters > 0 ? penTests.length / quarters : 0;
    }
    const criticalCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
    const riskTrend = criticalCount === 0 ? 'Improving' : criticalCount > 5 ? 'Worsening' : 'Stable';
    return {
        totalTests: penTests.length,
        totalVulnerabilities: vulnerabilities.length,
        criticalVulnerabilities: criticalCount,
        averageMTTR: Math.round(mttr * 10) / 10,
        remediationRate: Math.round(remediationRate),
        testCadence: Math.round(testCadence * 10) / 10,
        riskTrend,
    };
}
/**
 * Generate vulnerability trend analysis
 * @param vulnerabilities Vulnerabilities with timestamps
 * @param periodDays Analysis period in days
 * @returns Trend analysis
 */
function analyzeVulnerabilityTrends(vulnerabilities, periodDays = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);
    const recentVulns = vulnerabilities.filter(v => v.discoveredAt >= cutoffDate);
    const remediated = recentVulns.filter(v => v.remediatedAt && v.remediatedAt >= cutoffDate);
    const severityDistribution = {
        [VulnerabilitySeverity.CRITICAL]: 0,
        [VulnerabilitySeverity.HIGH]: 0,
        [VulnerabilitySeverity.MEDIUM]: 0,
        [VulnerabilitySeverity.LOW]: 0,
        [VulnerabilitySeverity.INFORMATIONAL]: 0,
    };
    recentVulns.forEach(v => {
        severityDistribution[v.severity]++;
    });
    const averagePerDay = recentVulns.length / periodDays;
    // Compare first half vs second half
    const midPoint = new Date(cutoffDate.getTime() + (Date.now() - cutoffDate.getTime()) / 2);
    const firstHalf = recentVulns.filter(v => v.discoveredAt < midPoint).length;
    const secondHalf = recentVulns.filter(v => v.discoveredAt >= midPoint).length;
    let trendDirection = 'stable';
    if (secondHalf > firstHalf * 1.2)
        trendDirection = 'increasing';
    else if (secondHalf < firstHalf * 0.8)
        trendDirection = 'decreasing';
    return {
        totalDiscovered: recentVulns.length,
        totalRemediated: remediated.length,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        severityDistribution,
        trendDirection,
    };
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let PenetrationTestingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PenetrationTestingService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createPenTest(data) {
            return createPenetrationTest(data);
        }
        async createVulnerability(data) {
            return createVulnerability(data);
        }
        async createRedTeamExercise(data) {
            return createRedTeamExercise(data);
        }
        async generatePenTestReport(penTestId) {
            const penTest = await PenetrationTest.findByPk(penTestId);
            if (!penTest) {
                throw new Error(`Penetration test ${penTestId} not found`);
            }
            const vulnerabilities = await Vulnerability.findAll({ where: { penTestId } });
            return {
                executiveSummary: generateExecutiveSummary(penTest, vulnerabilities),
                vulnerabilities: vulnerabilities.map(v => generateVulnerabilityReport(v)),
                remediationTimeline: calculateRemediationTimeline(vulnerabilities),
            };
        }
        async getSecurityMetrics() {
            const penTests = await PenetrationTest.findAll();
            const vulnerabilities = await Vulnerability.findAll();
            return generateSecurityTestingKPIs(penTests, vulnerabilities);
        }
    };
    __setFunctionName(_classThis, "PenetrationTestingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PenetrationTestingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PenetrationTestingService = _classThis;
})();
exports.PenetrationTestingService = PenetrationTestingService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    PenetrationTest,
    Vulnerability,
    RedTeamExercise,
    RemediationTask,
    // Model initialization
    initPenetrationTestModel,
    initVulnerabilityModel,
    initRedTeamExerciseModel,
    initRemediationTaskModel,
    // Planning functions
    createPenetrationTest,
    updatePenTestPhase,
    calculateScopeMetrics,
    generateScopeDocument,
    calculateCVSSScore,
    // Vulnerability tracking
    createVulnerability,
    updateVulnerabilityStatus,
    updatePenTestStatistics,
    trackExploitationAttempt,
    getVulnerabilitiesBySeverity,
    // Report generation
    generateExecutiveSummary,
    generateVulnerabilityReport,
    calculateRemediationTimeline,
    mapToOWASPTop10,
    // Remediation
    createRemediationTask,
    updateRemediationStatus,
    verifyRemediation,
    getOverdueRemediationTasks,
    calculateRemediationProgress,
    // Red team
    createRedTeamExercise,
    updateRedTeamObjective,
    trackSystemCompromise,
    calculateRedTeamMetrics,
    // Purple team
    schedulePurpleTeamActivity,
    recordPurpleTeamResults,
    generatePurpleTeamReport,
    // Metrics
    calculatePenTestCoverage,
    calculateMTTR,
    generateSecurityTestingKPIs,
    analyzeVulnerabilityTrends,
    // Service
    PenetrationTestingService,
};
//# sourceMappingURL=penetration-testing-kit.js.map