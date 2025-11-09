"use strict";
/**
 * LOC: THREATPOLICY89013
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Policy management services
 *   - Compliance enforcement controllers
 *   - Security governance modules
 *   - Audit and reporting services
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
exports.SecurityPolicyEnforcementService = exports.PolicyAuditLog = exports.PolicyException = exports.PolicyViolation = exports.ComplianceCheck = exports.SecurityPolicy = exports.PolicyComplianceReportDto = exports.CreateExceptionRequestDto = exports.CreateViolationDto = exports.CreateComplianceCheckDto = exports.CreateSecurityPolicyDto = exports.PolicyScope = exports.ExceptionStatus = exports.EnforcementAction = exports.ViolationStatus = exports.ViolationSeverity = exports.ComplianceStatus = exports.PolicyStatus = exports.PolicySeverity = exports.PolicyCategory = exports.PolicyFramework = void 0;
exports.initSecurityPolicyModel = initSecurityPolicyModel;
exports.initComplianceCheckModel = initComplianceCheckModel;
exports.initPolicyViolationModel = initPolicyViolationModel;
exports.initPolicyExceptionModel = initPolicyExceptionModel;
exports.initPolicyAuditLogModel = initPolicyAuditLogModel;
exports.createSecurityPolicy = createSecurityPolicy;
exports.updatePolicyStatus = updatePolicyStatus;
exports.createPolicyVersion = createPolicyVersion;
exports.getPolicyWithDetails = getPolicyWithDetails;
exports.getPoliciesByFramework = getPoliciesByFramework;
exports.createComplianceCheck = createComplianceCheck;
exports.executeComplianceCheck = executeComplianceCheck;
exports.validateAgainstPolicy = validateAgainstPolicy;
exports.calculatePolicyComplianceRate = calculatePolicyComplianceRate;
exports.createPolicyViolation = createPolicyViolation;
exports.updateViolationStatus = updateViolationStatus;
exports.detectPolicyViolations = detectPolicyViolations;
exports.getCriticalViolations = getCriticalViolations;
exports.executeEnforcementAction = executeEnforcementAction;
exports.autoRemediateViolation = autoRemediateViolation;
exports.scheduleAutomatedCheck = scheduleAutomatedCheck;
exports.createExceptionRequest = createExceptionRequest;
exports.reviewExceptionRequest = reviewExceptionRequest;
exports.findExpiredExceptions = findExpiredExceptions;
exports.revokeException = revokeException;
exports.logPolicyAction = logPolicyAction;
exports.generateComplianceReport = generateComplianceReport;
exports.getPolicyAuditTrail = getPolicyAuditTrail;
exports.defineSecurityBaseline = defineSecurityBaseline;
exports.validateSecurityBaseline = validateSecurityBaseline;
exports.enforceSecurityBaseline = enforceSecurityBaseline;
exports.checkConfigurationCompliance = checkConfigurationCompliance;
exports.generateConfigurationHardeningGuide = generateConfigurationHardeningGuide;
/**
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 * Locator: WC-THREAT-POLICY-001
 * Purpose: Enterprise Security Policy Enforcement - ISO 27001, NIST, CIS Controls compliant
 *
 * Upstream: Independent security policy enforcement utility module
 * Downstream: ../backend/*, Policy controllers, Compliance services, Security governance, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ utility functions for policy definition, compliance checking, violation detection, enforcement automation, exception management
 *
 * LLM Context: Enterprise-grade security policy enforcement framework compliant with ISO 27001, NIST CSF, CIS Controls.
 * Provides comprehensive policy definition and management, policy compliance checking and validation, policy violation detection and alerting,
 * automated policy enforcement, exception request and approval workflows, policy audit reporting, security baseline enforcement,
 * configuration compliance verification, policy versioning and change management, role-based policy application,
 * policy effectiveness measurement, remediation tracking, continuous compliance monitoring, policy template library,
 * and integrated governance, risk, and compliance (GRC) workflows with full audit trails.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
var PolicyFramework;
(function (PolicyFramework) {
    PolicyFramework["ISO_27001"] = "iso-27001";
    PolicyFramework["NIST_CSF"] = "nist-csf";
    PolicyFramework["CIS_CONTROLS"] = "cis-controls";
    PolicyFramework["HIPAA"] = "hipaa";
    PolicyFramework["PCI_DSS"] = "pci-dss";
    PolicyFramework["GDPR"] = "gdpr";
    PolicyFramework["SOC_2"] = "soc-2";
    PolicyFramework["CUSTOM"] = "custom";
})(PolicyFramework || (exports.PolicyFramework = PolicyFramework = {}));
var PolicyCategory;
(function (PolicyCategory) {
    PolicyCategory["ACCESS_CONTROL"] = "access-control";
    PolicyCategory["DATA_PROTECTION"] = "data-protection";
    PolicyCategory["NETWORK_SECURITY"] = "network-security";
    PolicyCategory["ENCRYPTION"] = "encryption";
    PolicyCategory["AUTHENTICATION"] = "authentication";
    PolicyCategory["INCIDENT_RESPONSE"] = "incident-response";
    PolicyCategory["CHANGE_MANAGEMENT"] = "change-management";
    PolicyCategory["ASSET_MANAGEMENT"] = "asset-management";
    PolicyCategory["VULNERABILITY_MANAGEMENT"] = "vulnerability-management";
    PolicyCategory["BACKUP_RECOVERY"] = "backup-recovery";
    PolicyCategory["MONITORING_LOGGING"] = "monitoring-logging";
    PolicyCategory["PHYSICAL_SECURITY"] = "physical-security";
})(PolicyCategory || (exports.PolicyCategory = PolicyCategory = {}));
var PolicySeverity;
(function (PolicySeverity) {
    PolicySeverity["CRITICAL"] = "critical";
    PolicySeverity["HIGH"] = "high";
    PolicySeverity["MEDIUM"] = "medium";
    PolicySeverity["LOW"] = "low";
    PolicySeverity["INFORMATIONAL"] = "informational";
})(PolicySeverity || (exports.PolicySeverity = PolicySeverity = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "draft";
    PolicyStatus["REVIEW"] = "review";
    PolicyStatus["APPROVED"] = "approved";
    PolicyStatus["ACTIVE"] = "active";
    PolicyStatus["SUSPENDED"] = "suspended";
    PolicyStatus["DEPRECATED"] = "deprecated";
    PolicyStatus["ARCHIVED"] = "archived";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non-compliant";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "partially-compliant";
    ComplianceStatus["NOT_APPLICABLE"] = "not-applicable";
    ComplianceStatus["PENDING_REVIEW"] = "pending-review";
    ComplianceStatus["EXCEPTION_GRANTED"] = "exception-granted";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var ViolationSeverity;
(function (ViolationSeverity) {
    ViolationSeverity["CRITICAL"] = "critical";
    ViolationSeverity["HIGH"] = "high";
    ViolationSeverity["MEDIUM"] = "medium";
    ViolationSeverity["LOW"] = "low";
})(ViolationSeverity || (exports.ViolationSeverity = ViolationSeverity = {}));
var ViolationStatus;
(function (ViolationStatus) {
    ViolationStatus["DETECTED"] = "detected";
    ViolationStatus["INVESTIGATING"] = "investigating";
    ViolationStatus["REMEDIATION_IN_PROGRESS"] = "remediation-in-progress";
    ViolationStatus["REMEDIATED"] = "remediated";
    ViolationStatus["EXCEPTION_REQUESTED"] = "exception-requested";
    ViolationStatus["EXCEPTION_GRANTED"] = "exception-granted";
    ViolationStatus["FALSE_POSITIVE"] = "false-positive";
})(ViolationStatus || (exports.ViolationStatus = ViolationStatus = {}));
var EnforcementAction;
(function (EnforcementAction) {
    EnforcementAction["ALERT"] = "alert";
    EnforcementAction["BLOCK"] = "block";
    EnforcementAction["QUARANTINE"] = "quarantine";
    EnforcementAction["DISABLE"] = "disable";
    EnforcementAction["TERMINATE"] = "terminate";
    EnforcementAction["NOTIFY"] = "notify";
    EnforcementAction["LOG_ONLY"] = "log-only";
})(EnforcementAction || (exports.EnforcementAction = EnforcementAction = {}));
var ExceptionStatus;
(function (ExceptionStatus) {
    ExceptionStatus["REQUESTED"] = "requested";
    ExceptionStatus["UNDER_REVIEW"] = "under-review";
    ExceptionStatus["APPROVED"] = "approved";
    ExceptionStatus["DENIED"] = "denied";
    ExceptionStatus["EXPIRED"] = "expired";
    ExceptionStatus["REVOKED"] = "revoked";
})(ExceptionStatus || (exports.ExceptionStatus = ExceptionStatus = {}));
var PolicyScope;
(function (PolicyScope) {
    PolicyScope["ORGANIZATION"] = "organization";
    PolicyScope["DEPARTMENT"] = "department";
    PolicyScope["TEAM"] = "team";
    PolicyScope["APPLICATION"] = "application";
    PolicyScope["SYSTEM"] = "system";
    PolicyScope["USER"] = "user";
})(PolicyScope || (exports.PolicyScope = PolicyScope = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
let CreateSecurityPolicyDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _rules_decorators;
    let _rules_initializers = [];
    let _rules_extraInitializers = [];
    let _enforcementAction_decorators;
    let _enforcementAction_initializers = [];
    let _enforcementAction_extraInitializers = [];
    let _applicableRoles_decorators;
    let _applicableRoles_initializers = [];
    let _applicableRoles_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateSecurityPolicyDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.framework = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
                this.category = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.severity = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.scope = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.rules = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _rules_initializers, void 0));
                this.enforcementAction = (__runInitializers(this, _rules_extraInitializers), __runInitializers(this, _enforcementAction_initializers, void 0));
                this.applicableRoles = (__runInitializers(this, _enforcementAction_extraInitializers), __runInitializers(this, _applicableRoles_initializers, void 0));
                this.metadata = (__runInitializers(this, _applicableRoles_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Password Complexity Requirements' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Enforces minimum password complexity standards' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _framework_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyFramework }), (0, class_validator_1.IsEnum)(PolicyFramework)];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyCategory }), (0, class_validator_1.IsEnum)(PolicyCategory)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicySeverity }), (0, class_validator_1.IsEnum)(PolicySeverity)];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyScope }), (0, class_validator_1.IsEnum)(PolicyScope)];
            _rules_decorators = [(0, swagger_1.ApiProperty)({ example: { minLength: 12, requireUppercase: true } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _enforcementAction_decorators = [(0, swagger_1.ApiProperty)({ enum: EnforcementAction }), (0, class_validator_1.IsEnum)(EnforcementAction)];
            _applicableRoles_decorators = [(0, swagger_1.ApiProperty)({ example: ['admin', 'security-team'] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { owner: 'security@example.com' } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _rules_decorators, { kind: "field", name: "rules", static: false, private: false, access: { has: obj => "rules" in obj, get: obj => obj.rules, set: (obj, value) => { obj.rules = value; } }, metadata: _metadata }, _rules_initializers, _rules_extraInitializers);
            __esDecorate(null, null, _enforcementAction_decorators, { kind: "field", name: "enforcementAction", static: false, private: false, access: { has: obj => "enforcementAction" in obj, get: obj => obj.enforcementAction, set: (obj, value) => { obj.enforcementAction = value; } }, metadata: _metadata }, _enforcementAction_initializers, _enforcementAction_extraInitializers);
            __esDecorate(null, null, _applicableRoles_decorators, { kind: "field", name: "applicableRoles", static: false, private: false, access: { has: obj => "applicableRoles" in obj, get: obj => obj.applicableRoles, set: (obj, value) => { obj.applicableRoles = value; } }, metadata: _metadata }, _applicableRoles_initializers, _applicableRoles_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSecurityPolicyDto = CreateSecurityPolicyDto;
let CreateComplianceCheckDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _checkCriteria_decorators;
    let _checkCriteria_initializers = [];
    let _checkCriteria_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _automated_decorators;
    let _automated_initializers = [];
    let _automated_extraInitializers = [];
    return _a = class CreateComplianceCheckDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.checkCriteria = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _checkCriteria_initializers, void 0));
                this.frequency = (__runInitializers(this, _checkCriteria_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.automated = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _automated_initializers, void 0));
                __runInitializers(this, _automated_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Password Policy Compliance' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'Verify all users have compliant passwords' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _checkCriteria_decorators = [(0, swagger_1.ApiProperty)({ example: { checkType: 'password-strength' } }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ example: 'daily' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _automated_decorators = [(0, swagger_1.ApiProperty)({ example: true }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _checkCriteria_decorators, { kind: "field", name: "checkCriteria", static: false, private: false, access: { has: obj => "checkCriteria" in obj, get: obj => obj.checkCriteria, set: (obj, value) => { obj.checkCriteria = value; } }, metadata: _metadata }, _checkCriteria_initializers, _checkCriteria_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _automated_decorators, { kind: "field", name: "automated", static: false, private: false, access: { has: obj => "automated" in obj, get: obj => obj.automated, set: (obj, value) => { obj.automated = value; } }, metadata: _metadata }, _automated_initializers, _automated_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateComplianceCheckDto = CreateComplianceCheckDto;
let CreateViolationDto = (() => {
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
    let _affectedEntity_decorators;
    let _affectedEntity_initializers = [];
    let _affectedEntity_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    return _a = class CreateViolationDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.affectedEntity = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _affectedEntity_initializers, void 0));
                this.evidence = (__runInitializers(this, _affectedEntity_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
                __runInitializers(this, _evidence_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Weak password detected' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ example: 'User password does not meet minimum complexity' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ViolationSeverity }), (0, class_validator_1.IsEnum)(ViolationSeverity)];
            _affectedEntity_decorators = [(0, swagger_1.ApiProperty)({ example: 'user-123' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _evidence_decorators = [(0, swagger_1.ApiProperty)({ example: { username: 'john.doe' } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _affectedEntity_decorators, { kind: "field", name: "affectedEntity", static: false, private: false, access: { has: obj => "affectedEntity" in obj, get: obj => obj.affectedEntity, set: (obj, value) => { obj.affectedEntity = value; } }, metadata: _metadata }, _affectedEntity_initializers, _affectedEntity_extraInitializers);
            __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateViolationDto = CreateViolationDto;
let CreateExceptionRequestDto = (() => {
    var _a;
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _requestedExpiryDate_decorators;
    let _requestedExpiryDate_initializers = [];
    let _requestedExpiryDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateExceptionRequestDto {
            constructor() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                this.justification = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.requestedExpiryDate = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _requestedExpiryDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _requestedExpiryDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiProperty)({ example: 'Legacy system requires simpler password' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(255)];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ example: 'System will be migrated within 90 days' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _requestedExpiryDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-06-01T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ example: { systemId: 'legacy-crm' } }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _requestedExpiryDate_decorators, { kind: "field", name: "requestedExpiryDate", static: false, private: false, access: { has: obj => "requestedExpiryDate" in obj, get: obj => obj.requestedExpiryDate, set: (obj, value) => { obj.requestedExpiryDate = value; } }, metadata: _metadata }, _requestedExpiryDate_initializers, _requestedExpiryDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateExceptionRequestDto = CreateExceptionRequestDto;
let PolicyComplianceReportDto = (() => {
    var _a;
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _frameworks_decorators;
    let _frameworks_initializers = [];
    let _frameworks_extraInitializers = [];
    let _categories_decorators;
    let _categories_initializers = [];
    let _categories_extraInitializers = [];
    return _a = class PolicyComplianceReportDto {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.frameworks = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _frameworks_initializers, void 0));
                this.categories = (__runInitializers(this, _frameworks_extraInitializers), __runInitializers(this, _categories_initializers, void 0));
                __runInitializers(this, _categories_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-01-01T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ example: '2025-03-31T00:00:00Z' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _frameworks_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyFramework, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(PolicyFramework, { each: true }), (0, class_validator_1.IsOptional)()];
            _categories_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyCategory, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(PolicyCategory, { each: true }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _frameworks_decorators, { kind: "field", name: "frameworks", static: false, private: false, access: { has: obj => "frameworks" in obj, get: obj => obj.frameworks, set: (obj, value) => { obj.frameworks = value; } }, metadata: _metadata }, _frameworks_initializers, _frameworks_extraInitializers);
            __esDecorate(null, null, _categories_decorators, { kind: "field", name: "categories", static: false, private: false, access: { has: obj => "categories" in obj, get: obj => obj.categories, set: (obj, value) => { obj.categories = value; } }, metadata: _metadata }, _categories_initializers, _categories_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PolicyComplianceReportDto = PolicyComplianceReportDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let SecurityPolicy = (() => {
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
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _rules_decorators;
    let _rules_initializers = [];
    let _rules_extraInitializers = [];
    let _enforcementAction_decorators;
    let _enforcementAction_initializers = [];
    let _enforcementAction_extraInitializers = [];
    let _applicableRoles_decorators;
    let _applicableRoles_initializers = [];
    let _applicableRoles_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _nextReviewDate_decorators;
    let _nextReviewDate_initializers = [];
    let _nextReviewDate_extraInitializers = [];
    let _violationCount_decorators;
    let _violationCount_initializers = [];
    let _violationCount_extraInitializers = [];
    let _complianceRate_decorators;
    let _complianceRate_initializers = [];
    let _complianceRate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class SecurityPolicy extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.framework = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
                this.category = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.severity = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.scope = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.rules = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _rules_initializers, void 0));
                this.enforcementAction = (__runInitializers(this, _rules_extraInitializers), __runInitializers(this, _enforcementAction_initializers, void 0));
                this.applicableRoles = (__runInitializers(this, _enforcementAction_extraInitializers), __runInitializers(this, _applicableRoles_initializers, void 0));
                this.status = (__runInitializers(this, _applicableRoles_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.version = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.approvedBy = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expiryDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
                this.lastReviewDate = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
                this.nextReviewDate = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _nextReviewDate_initializers, void 0));
                this.violationCount = (__runInitializers(this, _nextReviewDate_extraInitializers), __runInitializers(this, _violationCount_initializers, void 0));
                this.complianceRate = (__runInitializers(this, _violationCount_extraInitializers), __runInitializers(this, _complianceRate_initializers, void 0));
                this.metadata = (__runInitializers(this, _complianceRate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _framework_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyFramework })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyCategory })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicySeverity })];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyScope })];
            _rules_decorators = [(0, swagger_1.ApiProperty)()];
            _enforcementAction_decorators = [(0, swagger_1.ApiProperty)({ enum: EnforcementAction })];
            _applicableRoles_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: PolicyStatus })];
            _version_decorators = [(0, swagger_1.ApiProperty)()];
            _approvedBy_decorators = [(0, swagger_1.ApiProperty)()];
            _approvedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)()];
            _expiryDate_decorators = [(0, swagger_1.ApiProperty)()];
            _lastReviewDate_decorators = [(0, swagger_1.ApiProperty)()];
            _nextReviewDate_decorators = [(0, swagger_1.ApiProperty)()];
            _violationCount_decorators = [(0, swagger_1.ApiProperty)()];
            _complianceRate_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _rules_decorators, { kind: "field", name: "rules", static: false, private: false, access: { has: obj => "rules" in obj, get: obj => obj.rules, set: (obj, value) => { obj.rules = value; } }, metadata: _metadata }, _rules_initializers, _rules_extraInitializers);
            __esDecorate(null, null, _enforcementAction_decorators, { kind: "field", name: "enforcementAction", static: false, private: false, access: { has: obj => "enforcementAction" in obj, get: obj => obj.enforcementAction, set: (obj, value) => { obj.enforcementAction = value; } }, metadata: _metadata }, _enforcementAction_initializers, _enforcementAction_extraInitializers);
            __esDecorate(null, null, _applicableRoles_decorators, { kind: "field", name: "applicableRoles", static: false, private: false, access: { has: obj => "applicableRoles" in obj, get: obj => obj.applicableRoles, set: (obj, value) => { obj.applicableRoles = value; } }, metadata: _metadata }, _applicableRoles_initializers, _applicableRoles_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
            __esDecorate(null, null, _nextReviewDate_decorators, { kind: "field", name: "nextReviewDate", static: false, private: false, access: { has: obj => "nextReviewDate" in obj, get: obj => obj.nextReviewDate, set: (obj, value) => { obj.nextReviewDate = value; } }, metadata: _metadata }, _nextReviewDate_initializers, _nextReviewDate_extraInitializers);
            __esDecorate(null, null, _violationCount_decorators, { kind: "field", name: "violationCount", static: false, private: false, access: { has: obj => "violationCount" in obj, get: obj => obj.violationCount, set: (obj, value) => { obj.violationCount = value; } }, metadata: _metadata }, _violationCount_initializers, _violationCount_extraInitializers);
            __esDecorate(null, null, _complianceRate_decorators, { kind: "field", name: "complianceRate", static: false, private: false, access: { has: obj => "complianceRate" in obj, get: obj => obj.complianceRate, set: (obj, value) => { obj.complianceRate = value; } }, metadata: _metadata }, _complianceRate_initializers, _complianceRate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SecurityPolicy = SecurityPolicy;
let ComplianceCheck = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _checkCriteria_decorators;
    let _checkCriteria_initializers = [];
    let _checkCriteria_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _automated_decorators;
    let _automated_initializers = [];
    let _automated_extraInitializers = [];
    let _lastCheckDate_decorators;
    let _lastCheckDate_initializers = [];
    let _lastCheckDate_extraInitializers = [];
    let _nextCheckDate_decorators;
    let _nextCheckDate_initializers = [];
    let _nextCheckDate_extraInitializers = [];
    let _lastCheckStatus_decorators;
    let _lastCheckStatus_initializers = [];
    let _lastCheckStatus_extraInitializers = [];
    let _passRate_decorators;
    let _passRate_initializers = [];
    let _passRate_extraInitializers = [];
    let _failCount_decorators;
    let _failCount_initializers = [];
    let _failCount_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class ComplianceCheck extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.name = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.checkCriteria = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _checkCriteria_initializers, void 0));
                this.frequency = (__runInitializers(this, _checkCriteria_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.automated = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _automated_initializers, void 0));
                this.lastCheckDate = (__runInitializers(this, _automated_extraInitializers), __runInitializers(this, _lastCheckDate_initializers, void 0));
                this.nextCheckDate = (__runInitializers(this, _lastCheckDate_extraInitializers), __runInitializers(this, _nextCheckDate_initializers, void 0));
                this.lastCheckStatus = (__runInitializers(this, _nextCheckDate_extraInitializers), __runInitializers(this, _lastCheckStatus_initializers, void 0));
                this.passRate = (__runInitializers(this, _lastCheckStatus_extraInitializers), __runInitializers(this, _passRate_initializers, void 0));
                this.failCount = (__runInitializers(this, _passRate_extraInitializers), __runInitializers(this, _failCount_initializers, void 0));
                this.metadata = (__runInitializers(this, _failCount_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _policyId_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _checkCriteria_decorators = [(0, swagger_1.ApiProperty)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)()];
            _automated_decorators = [(0, swagger_1.ApiProperty)()];
            _lastCheckDate_decorators = [(0, swagger_1.ApiProperty)()];
            _nextCheckDate_decorators = [(0, swagger_1.ApiProperty)()];
            _lastCheckStatus_decorators = [(0, swagger_1.ApiProperty)({ enum: ComplianceStatus })];
            _passRate_decorators = [(0, swagger_1.ApiProperty)()];
            _failCount_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _checkCriteria_decorators, { kind: "field", name: "checkCriteria", static: false, private: false, access: { has: obj => "checkCriteria" in obj, get: obj => obj.checkCriteria, set: (obj, value) => { obj.checkCriteria = value; } }, metadata: _metadata }, _checkCriteria_initializers, _checkCriteria_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _automated_decorators, { kind: "field", name: "automated", static: false, private: false, access: { has: obj => "automated" in obj, get: obj => obj.automated, set: (obj, value) => { obj.automated = value; } }, metadata: _metadata }, _automated_initializers, _automated_extraInitializers);
            __esDecorate(null, null, _lastCheckDate_decorators, { kind: "field", name: "lastCheckDate", static: false, private: false, access: { has: obj => "lastCheckDate" in obj, get: obj => obj.lastCheckDate, set: (obj, value) => { obj.lastCheckDate = value; } }, metadata: _metadata }, _lastCheckDate_initializers, _lastCheckDate_extraInitializers);
            __esDecorate(null, null, _nextCheckDate_decorators, { kind: "field", name: "nextCheckDate", static: false, private: false, access: { has: obj => "nextCheckDate" in obj, get: obj => obj.nextCheckDate, set: (obj, value) => { obj.nextCheckDate = value; } }, metadata: _metadata }, _nextCheckDate_initializers, _nextCheckDate_extraInitializers);
            __esDecorate(null, null, _lastCheckStatus_decorators, { kind: "field", name: "lastCheckStatus", static: false, private: false, access: { has: obj => "lastCheckStatus" in obj, get: obj => obj.lastCheckStatus, set: (obj, value) => { obj.lastCheckStatus = value; } }, metadata: _metadata }, _lastCheckStatus_initializers, _lastCheckStatus_extraInitializers);
            __esDecorate(null, null, _passRate_decorators, { kind: "field", name: "passRate", static: false, private: false, access: { has: obj => "passRate" in obj, get: obj => obj.passRate, set: (obj, value) => { obj.passRate = value; } }, metadata: _metadata }, _passRate_initializers, _passRate_extraInitializers);
            __esDecorate(null, null, _failCount_decorators, { kind: "field", name: "failCount", static: false, private: false, access: { has: obj => "failCount" in obj, get: obj => obj.failCount, set: (obj, value) => { obj.failCount = value; } }, metadata: _metadata }, _failCount_initializers, _failCount_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ComplianceCheck = ComplianceCheck;
let PolicyViolation = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _complianceCheckId_decorators;
    let _complianceCheckId_initializers = [];
    let _complianceCheckId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _affectedEntity_decorators;
    let _affectedEntity_initializers = [];
    let _affectedEntity_extraInitializers = [];
    let _evidence_decorators;
    let _evidence_initializers = [];
    let _evidence_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _detectedAt_decorators;
    let _detectedAt_initializers = [];
    let _detectedAt_extraInitializers = [];
    let _acknowledgedAt_decorators;
    let _acknowledgedAt_initializers = [];
    let _acknowledgedAt_extraInitializers = [];
    let _remediatedAt_decorators;
    let _remediatedAt_initializers = [];
    let _remediatedAt_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _remediationNotes_decorators;
    let _remediationNotes_initializers = [];
    let _remediationNotes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class PolicyViolation extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.complianceCheckId = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _complianceCheckId_initializers, void 0));
                this.title = (__runInitializers(this, _complianceCheckId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.affectedEntity = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _affectedEntity_initializers, void 0));
                this.evidence = (__runInitializers(this, _affectedEntity_extraInitializers), __runInitializers(this, _evidence_initializers, void 0));
                this.status = (__runInitializers(this, _evidence_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.detectedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _detectedAt_initializers, void 0));
                this.acknowledgedAt = (__runInitializers(this, _detectedAt_extraInitializers), __runInitializers(this, _acknowledgedAt_initializers, void 0));
                this.remediatedAt = (__runInitializers(this, _acknowledgedAt_extraInitializers), __runInitializers(this, _remediatedAt_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _remediatedAt_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.remediationNotes = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _remediationNotes_initializers, void 0));
                this.metadata = (__runInitializers(this, _remediationNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _policyId_decorators = [(0, swagger_1.ApiProperty)()];
            _complianceCheckId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ViolationSeverity })];
            _affectedEntity_decorators = [(0, swagger_1.ApiProperty)()];
            _evidence_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ViolationStatus })];
            _detectedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _acknowledgedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _remediatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)()];
            _remediationNotes_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _complianceCheckId_decorators, { kind: "field", name: "complianceCheckId", static: false, private: false, access: { has: obj => "complianceCheckId" in obj, get: obj => obj.complianceCheckId, set: (obj, value) => { obj.complianceCheckId = value; } }, metadata: _metadata }, _complianceCheckId_initializers, _complianceCheckId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _affectedEntity_decorators, { kind: "field", name: "affectedEntity", static: false, private: false, access: { has: obj => "affectedEntity" in obj, get: obj => obj.affectedEntity, set: (obj, value) => { obj.affectedEntity = value; } }, metadata: _metadata }, _affectedEntity_initializers, _affectedEntity_extraInitializers);
            __esDecorate(null, null, _evidence_decorators, { kind: "field", name: "evidence", static: false, private: false, access: { has: obj => "evidence" in obj, get: obj => obj.evidence, set: (obj, value) => { obj.evidence = value; } }, metadata: _metadata }, _evidence_initializers, _evidence_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _detectedAt_decorators, { kind: "field", name: "detectedAt", static: false, private: false, access: { has: obj => "detectedAt" in obj, get: obj => obj.detectedAt, set: (obj, value) => { obj.detectedAt = value; } }, metadata: _metadata }, _detectedAt_initializers, _detectedAt_extraInitializers);
            __esDecorate(null, null, _acknowledgedAt_decorators, { kind: "field", name: "acknowledgedAt", static: false, private: false, access: { has: obj => "acknowledgedAt" in obj, get: obj => obj.acknowledgedAt, set: (obj, value) => { obj.acknowledgedAt = value; } }, metadata: _metadata }, _acknowledgedAt_initializers, _acknowledgedAt_extraInitializers);
            __esDecorate(null, null, _remediatedAt_decorators, { kind: "field", name: "remediatedAt", static: false, private: false, access: { has: obj => "remediatedAt" in obj, get: obj => obj.remediatedAt, set: (obj, value) => { obj.remediatedAt = value; } }, metadata: _metadata }, _remediatedAt_initializers, _remediatedAt_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _remediationNotes_decorators, { kind: "field", name: "remediationNotes", static: false, private: false, access: { has: obj => "remediationNotes" in obj, get: obj => obj.remediationNotes, set: (obj, value) => { obj.remediationNotes = value; } }, metadata: _metadata }, _remediationNotes_initializers, _remediationNotes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PolicyViolation = PolicyViolation;
let PolicyException = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _violationId_decorators;
    let _violationId_initializers = [];
    let _violationId_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewedAt_decorators;
    let _reviewedAt_initializers = [];
    let _reviewedAt_extraInitializers = [];
    let _reviewNotes_decorators;
    let _reviewNotes_initializers = [];
    let _reviewNotes_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class PolicyException extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.violationId = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _violationId_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _violationId_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                this.reason = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.justification = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.status = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.reviewedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
                this.reviewedAt = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedAt_initializers, void 0));
                this.reviewNotes = (__runInitializers(this, _reviewedAt_extraInitializers), __runInitializers(this, _reviewNotes_initializers, void 0));
                this.approvedAt = (__runInitializers(this, _reviewNotes_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
                this.expiryDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
                this.conditions = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                this.metadata = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _policyId_decorators = [(0, swagger_1.ApiProperty)()];
            _violationId_decorators = [(0, swagger_1.ApiProperty)()];
            _requestedBy_decorators = [(0, swagger_1.ApiProperty)()];
            _reason_decorators = [(0, swagger_1.ApiProperty)()];
            _justification_decorators = [(0, swagger_1.ApiProperty)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ExceptionStatus })];
            _reviewedBy_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _reviewNotes_decorators = [(0, swagger_1.ApiProperty)()];
            _approvedAt_decorators = [(0, swagger_1.ApiProperty)()];
            _expiryDate_decorators = [(0, swagger_1.ApiProperty)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _violationId_decorators, { kind: "field", name: "violationId", static: false, private: false, access: { has: obj => "violationId" in obj, get: obj => obj.violationId, set: (obj, value) => { obj.violationId = value; } }, metadata: _metadata }, _violationId_initializers, _violationId_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
            __esDecorate(null, null, _reviewedAt_decorators, { kind: "field", name: "reviewedAt", static: false, private: false, access: { has: obj => "reviewedAt" in obj, get: obj => obj.reviewedAt, set: (obj, value) => { obj.reviewedAt = value; } }, metadata: _metadata }, _reviewedAt_initializers, _reviewedAt_extraInitializers);
            __esDecorate(null, null, _reviewNotes_decorators, { kind: "field", name: "reviewNotes", static: false, private: false, access: { has: obj => "reviewNotes" in obj, get: obj => obj.reviewNotes, set: (obj, value) => { obj.reviewNotes = value; } }, metadata: _metadata }, _reviewNotes_initializers, _reviewNotes_extraInitializers);
            __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
            __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PolicyException = PolicyException;
let PolicyAuditLog = (() => {
    var _a;
    let _classSuper = sequelize_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _policyId_decorators;
    let _policyId_initializers = [];
    let _policyId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    return _a = class PolicyAuditLog extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.policyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.action = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.performedBy = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
                this.changes = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
                this.timestamp = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.metadata = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _policyId_decorators = [(0, swagger_1.ApiProperty)()];
            _action_decorators = [(0, swagger_1.ApiProperty)()];
            _performedBy_decorators = [(0, swagger_1.ApiProperty)()];
            _changes_decorators = [(0, swagger_1.ApiProperty)()];
            _timestamp_decorators = [(0, swagger_1.ApiProperty)()];
            _ipAddress_decorators = [(0, swagger_1.ApiProperty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
            __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PolicyAuditLog = PolicyAuditLog;
// ============================================================================
// MODEL INITIALIZATION FUNCTIONS
// ============================================================================
/**
 * Initialize Security Policy model
 * @param sequelize Sequelize instance
 * @returns SecurityPolicy model
 */
function initSecurityPolicyModel(sequelize) {
    SecurityPolicy.init({
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
            allowNull: false,
        },
        framework: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyFramework)),
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyCategory)),
            allowNull: false,
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicySeverity)),
            allowNull: false,
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyScope)),
            allowNull: false,
        },
        rules: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        enforcementAction: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(EnforcementAction)),
            allowNull: false,
        },
        applicableRoles: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PolicyStatus)),
            allowNull: false,
            defaultValue: PolicyStatus.DRAFT,
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lastReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        nextReviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        violationCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        complianceRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'security_policies',
        timestamps: true,
        indexes: [
            { fields: ['framework'] },
            { fields: ['category'] },
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['scope'] },
        ],
    });
    return SecurityPolicy;
}
/**
 * Initialize Compliance Check model
 * @param sequelize Sequelize instance
 * @returns ComplianceCheck model
 */
function initComplianceCheckModel(sequelize) {
    ComplianceCheck.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'security_policies',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        checkCriteria: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        frequency: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        automated: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        lastCheckDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        nextCheckDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        lastCheckStatus: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ComplianceStatus)),
            allowNull: true,
        },
        passRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        failCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'compliance_checks',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['lastCheckStatus'] },
            { fields: ['nextCheckDate'] },
        ],
    });
    return ComplianceCheck;
}
/**
 * Initialize Policy Violation model
 * @param sequelize Sequelize instance
 * @returns PolicyViolation model
 */
function initPolicyViolationModel(sequelize) {
    PolicyViolation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'security_policies',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        complianceCheckId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'compliance_checks',
                key: 'id',
            },
            onDelete: 'SET NULL',
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
            type: sequelize_1.DataTypes.ENUM(...Object.values(ViolationSeverity)),
            allowNull: false,
        },
        affectedEntity: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        evidence: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ViolationStatus)),
            allowNull: false,
            defaultValue: ViolationStatus.DETECTED,
        },
        detectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        acknowledgedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        remediatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        remediationNotes: {
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
        tableName: 'policy_violations',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['complianceCheckId'] },
            { fields: ['severity'] },
            { fields: ['status'] },
            { fields: ['affectedEntity'] },
            { fields: ['detectedAt'] },
        ],
    });
    return PolicyViolation;
}
/**
 * Initialize Policy Exception model
 * @param sequelize Sequelize instance
 * @returns PolicyException model
 */
function initPolicyExceptionModel(sequelize) {
    PolicyException.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'security_policies',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        violationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'policy_violations',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        reason: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        justification: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ExceptionStatus)),
            allowNull: false,
            defaultValue: ExceptionStatus.REQUESTED,
        },
        reviewedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        reviewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        reviewNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        expiryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'policy_exceptions',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['violationId'] },
            { fields: ['status'] },
            { fields: ['requestedBy'] },
            { fields: ['expiryDate'] },
        ],
    });
    return PolicyException;
}
/**
 * Initialize Policy Audit Log model
 * @param sequelize Sequelize instance
 * @returns PolicyAuditLog model
 */
function initPolicyAuditLogModel(sequelize) {
    PolicyAuditLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        policyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'security_policies',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        performedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        changes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'policy_audit_logs',
        timestamps: true,
        indexes: [
            { fields: ['policyId'] },
            { fields: ['action'] },
            { fields: ['performedBy'] },
            { fields: ['timestamp'] },
        ],
    });
    return PolicyAuditLog;
}
// ============================================================================
// POLICY DEFINITION AND MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create a new security policy
 * @param data Policy data
 * @param transaction Optional transaction
 * @returns Created policy
 */
async function createSecurityPolicy(data, transaction) {
    return await SecurityPolicy.create({
        ...data,
        status: PolicyStatus.DRAFT,
        version: 1,
        violationCount: 0,
    }, { transaction });
}
/**
 * Update policy status
 * @param policyId Policy ID
 * @param status New status
 * @param approvedBy Approver user ID
 * @param transaction Optional transaction
 * @returns Updated policy
 */
async function updatePolicyStatus(policyId, status, approvedBy, transaction) {
    const policy = await SecurityPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new Error(`Security policy ${policyId} not found`);
    }
    const oldStatus = policy.status;
    policy.status = status;
    if (status === PolicyStatus.APPROVED && approvedBy) {
        policy.approvedBy = approvedBy;
        policy.approvedAt = new Date();
    }
    if (status === PolicyStatus.ACTIVE && !policy.effectiveDate) {
        policy.effectiveDate = new Date();
        // Set next review date to 1 year from now
        const nextReview = new Date();
        nextReview.setFullYear(nextReview.getFullYear() + 1);
        policy.nextReviewDate = nextReview;
    }
    await policy.save({ transaction });
    // Log the status change
    await logPolicyAction(policyId, 'status_change', approvedBy || 'system', { oldStatus, newStatus: status }, transaction);
    return policy;
}
/**
 * Create new policy version
 * @param policyId Policy ID
 * @param updates Policy updates
 * @param updatedBy User ID
 * @param transaction Optional transaction
 * @returns New policy version
 */
async function createPolicyVersion(policyId, updates, updatedBy, transaction) {
    const currentPolicy = await SecurityPolicy.findByPk(policyId, { transaction });
    if (!currentPolicy) {
        throw new Error(`Security policy ${policyId} not found`);
    }
    // Archive current policy
    currentPolicy.status = PolicyStatus.ARCHIVED;
    await currentPolicy.save({ transaction });
    // Create new version
    const newPolicy = await SecurityPolicy.create({
        ...currentPolicy.toJSON(),
        ...updates,
        id: undefined,
        version: currentPolicy.version + 1,
        status: PolicyStatus.DRAFT,
        approvedBy: null,
        approvedAt: null,
        effectiveDate: null,
    }, { transaction });
    await logPolicyAction(newPolicy.id, 'version_created', updatedBy, { previousVersion: currentPolicy.version, newVersion: newPolicy.version }, transaction);
    return newPolicy;
}
/**
 * Get policy by ID with full details
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Policy with related data
 */
async function getPolicyWithDetails(policyId, transaction) {
    const policy = await SecurityPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new Error(`Security policy ${policyId} not found`);
    }
    const checks = await ComplianceCheck.findAll({
        where: { policyId },
        transaction,
    });
    const activeViolations = await PolicyViolation.findAll({
        where: {
            policyId,
            status: {
                [sequelize_1.Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
            },
        },
        transaction,
    });
    const exceptions = await PolicyException.findAll({
        where: {
            policyId,
            status: {
                [sequelize_1.Op.in]: [ExceptionStatus.APPROVED, ExceptionStatus.UNDER_REVIEW],
            },
        },
        transaction,
    });
    return { policy, checks, activeViolations, exceptions };
}
/**
 * Get policies by framework
 * @param framework Policy framework
 * @param transaction Optional transaction
 * @returns Policies
 */
async function getPoliciesByFramework(framework, transaction) {
    return await SecurityPolicy.findAll({
        where: {
            framework,
            status: {
                [sequelize_1.Op.in]: [PolicyStatus.ACTIVE, PolicyStatus.APPROVED],
            },
        },
        order: [['severity', 'DESC'], ['name', 'ASC']],
        transaction,
    });
}
// ============================================================================
// POLICY COMPLIANCE CHECKING FUNCTIONS
// ============================================================================
/**
 * Create compliance check
 * @param policyId Policy ID
 * @param data Check data
 * @param transaction Optional transaction
 * @returns Created check
 */
async function createComplianceCheck(policyId, data, transaction) {
    return await ComplianceCheck.create({
        policyId,
        ...data,
        failCount: 0,
    }, { transaction });
}
/**
 * Execute compliance check
 * @param checkId Check ID
 * @param checkFunction Function to perform the check
 * @param transaction Optional transaction
 * @returns Check results
 */
async function executeComplianceCheck(checkId, checkFunction, transaction) {
    const check = await ComplianceCheck.findByPk(checkId, { transaction });
    if (!check) {
        throw new Error(`Compliance check ${checkId} not found`);
    }
    const results = await checkFunction();
    check.lastCheckDate = new Date();
    check.lastCheckStatus = results.passed ? ComplianceStatus.COMPLIANT : ComplianceStatus.NON_COMPLIANT;
    check.failCount = results.failedEntities.length;
    // Calculate next check date based on frequency
    if (check.frequency) {
        const nextDate = new Date();
        if (check.frequency === 'daily')
            nextDate.setDate(nextDate.getDate() + 1);
        else if (check.frequency === 'weekly')
            nextDate.setDate(nextDate.getDate() + 7);
        else if (check.frequency === 'monthly')
            nextDate.setMonth(nextDate.getMonth() + 1);
        check.nextCheckDate = nextDate;
    }
    await check.save({ transaction });
    // Create violations for failed entities
    for (const entity of results.failedEntities) {
        await createPolicyViolation(check.policyId, {
            title: `${check.name} - Failed`,
            description: `Entity ${entity} failed compliance check`,
            severity: ViolationSeverity.MEDIUM,
            affectedEntity: entity,
        }, checkId, transaction);
    }
    return check;
}
/**
 * Validate entity against policy rules
 * @param policy Security policy
 * @param entityData Entity data to validate
 * @returns Validation result
 */
function validateAgainstPolicy(policy, entityData) {
    const violations = [];
    const details = {};
    for (const [ruleKey, ruleValue] of Object.entries(policy.rules)) {
        const entityValue = entityData[ruleKey];
        if (typeof ruleValue === 'boolean') {
            if (entityValue !== ruleValue) {
                violations.push(`${ruleKey} must be ${ruleValue}`);
                details[ruleKey] = { expected: ruleValue, actual: entityValue };
            }
        }
        else if (typeof ruleValue === 'number') {
            if (entityValue < ruleValue) {
                violations.push(`${ruleKey} must be at least ${ruleValue}`);
                details[ruleKey] = { minimum: ruleValue, actual: entityValue };
            }
        }
        else if (Array.isArray(ruleValue)) {
            if (!ruleValue.includes(entityValue)) {
                violations.push(`${ruleKey} must be one of: ${ruleValue.join(', ')}`);
                details[ruleKey] = { allowed: ruleValue, actual: entityValue };
            }
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
        details,
    };
}
/**
 * Calculate policy compliance rate
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance rate
 */
async function calculatePolicyComplianceRate(policyId, transaction) {
    const checks = await ComplianceCheck.findAll({
        where: { policyId },
        transaction,
    });
    if (checks.length === 0)
        return 100;
    const compliantChecks = checks.filter(c => c.lastCheckStatus === ComplianceStatus.COMPLIANT).length;
    const rate = (compliantChecks / checks.length) * 100;
    // Update policy compliance rate
    await SecurityPolicy.update({ complianceRate: rate }, { where: { id: policyId }, transaction });
    return rate;
}
// ============================================================================
// POLICY VIOLATION DETECTION FUNCTIONS
// ============================================================================
/**
 * Create policy violation
 * @param policyId Policy ID
 * @param data Violation data
 * @param complianceCheckId Optional compliance check ID
 * @param transaction Optional transaction
 * @returns Created violation
 */
async function createPolicyViolation(policyId, data, complianceCheckId, transaction) {
    const violation = await PolicyViolation.create({
        policyId,
        complianceCheckId,
        ...data,
        status: ViolationStatus.DETECTED,
        detectedAt: new Date(),
    }, { transaction });
    // Update policy violation count
    await SecurityPolicy.increment('violationCount', {
        where: { id: policyId },
        transaction,
    });
    return violation;
}
/**
 * Update violation status
 * @param violationId Violation ID
 * @param status New status
 * @param assignedTo Assignee
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated violation
 */
async function updateViolationStatus(violationId, status, assignedTo, notes, transaction) {
    const violation = await PolicyViolation.findByPk(violationId, { transaction });
    if (!violation) {
        throw new Error(`Policy violation ${violationId} not found`);
    }
    violation.status = status;
    if (assignedTo)
        violation.assignedTo = assignedTo;
    if (notes)
        violation.remediationNotes = notes;
    if (status === ViolationStatus.REMEDIATED && !violation.remediatedAt) {
        violation.remediatedAt = new Date();
    }
    await violation.save({ transaction });
    return violation;
}
/**
 * Detect violations for a specific policy
 * @param policyId Policy ID
 * @param entities Entities to check
 * @param transaction Optional transaction
 * @returns Detected violations
 */
async function detectPolicyViolations(policyId, entities, transaction) {
    const policy = await SecurityPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new Error(`Security policy ${policyId} not found`);
    }
    const violations = [];
    for (const entity of entities) {
        const validation = validateAgainstPolicy(policy, entity.data);
        if (!validation.compliant) {
            const violation = await createPolicyViolation(policyId, {
                title: `${policy.name} Violation`,
                description: validation.violations.join('; '),
                severity: policy.severity,
                affectedEntity: entity.id,
                evidence: validation.details,
            }, undefined, transaction);
            violations.push(violation);
        }
    }
    return violations;
}
/**
 * Get critical violations
 * @param transaction Optional transaction
 * @returns Critical violations
 */
async function getCriticalViolations(transaction) {
    return await PolicyViolation.findAll({
        where: {
            severity: ViolationSeverity.CRITICAL,
            status: {
                [sequelize_1.Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
            },
        },
        order: [['detectedAt', 'DESC']],
        transaction,
    });
}
// ============================================================================
// POLICY ENFORCEMENT AUTOMATION FUNCTIONS
// ============================================================================
/**
 * Execute enforcement action for violation
 * @param violationId Violation ID
 * @param transaction Optional transaction
 * @returns Enforcement result
 */
async function executeEnforcementAction(violationId, transaction) {
    const violation = await PolicyViolation.findByPk(violationId, {
        include: [SecurityPolicy],
        transaction,
    });
    if (!violation) {
        throw new Error(`Policy violation ${violationId} not found`);
    }
    const policy = await SecurityPolicy.findByPk(violation.policyId, { transaction });
    if (!policy) {
        throw new Error(`Security policy not found`);
    }
    const action = policy.enforcementAction;
    // Log the enforcement action
    if (!violation.metadata)
        violation.metadata = {};
    if (!violation.metadata.enforcementActions) {
        violation.metadata.enforcementActions = [];
    }
    violation.metadata.enforcementActions.push({
        action,
        timestamp: new Date().toISOString(),
        status: 'executed',
    });
    await violation.save({ transaction });
    return {
        action,
        success: true,
        details: `Enforcement action ${action} executed for violation ${violationId}`,
    };
}
/**
 * Auto-remediate violations where possible
 * @param violationId Violation ID
 * @param remediationFunction Function to perform auto-remediation
 * @param transaction Optional transaction
 * @returns Remediation result
 */
async function autoRemediateViolation(violationId, remediationFunction, transaction) {
    const violation = await PolicyViolation.findByPk(violationId, { transaction });
    if (!violation) {
        throw new Error(`Policy violation ${violationId} not found`);
    }
    try {
        const success = await remediationFunction();
        if (success) {
            violation.status = ViolationStatus.REMEDIATED;
            violation.remediatedAt = new Date();
            violation.remediationNotes = 'Auto-remediated by system';
            if (!violation.metadata)
                violation.metadata = {};
            violation.metadata.autoRemediated = true;
            await violation.save({ transaction });
        }
    }
    catch (error) {
        // Log remediation failure
        if (!violation.metadata)
            violation.metadata = {};
        violation.metadata.autoRemediationFailed = {
            timestamp: new Date().toISOString(),
            error: error.message,
        };
        await violation.save({ transaction });
    }
    return violation;
}
/**
 * Schedule automated compliance check
 * @param checkId Compliance check ID
 * @param checkFunction Function to perform the check
 * @returns Scheduled task info
 */
function scheduleAutomatedCheck(checkId, checkFunction) {
    // In production, this would integrate with a job scheduler like Bull or node-cron
    const nextRun = new Date();
    nextRun.setHours(nextRun.getHours() + 24);
    return {
        checkId,
        scheduled: true,
        nextRun,
    };
}
// ============================================================================
// EXCEPTION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create exception request
 * @param policyId Policy ID
 * @param violationId Violation ID
 * @param requestedBy User ID
 * @param data Exception request data
 * @param transaction Optional transaction
 * @returns Created exception
 */
async function createExceptionRequest(policyId, violationId, requestedBy, data, transaction) {
    const exception = await PolicyException.create({
        policyId,
        violationId,
        requestedBy,
        ...data,
        status: ExceptionStatus.REQUESTED,
        expiryDate: data.requestedExpiryDate,
    }, { transaction });
    // Update violation status
    await PolicyViolation.update({ status: ViolationStatus.EXCEPTION_REQUESTED }, { where: { id: violationId }, transaction });
    return exception;
}
/**
 * Review exception request
 * @param exceptionId Exception ID
 * @param approved Whether approved
 * @param reviewedBy Reviewer user ID
 * @param reviewNotes Review notes
 * @param transaction Optional transaction
 * @returns Updated exception
 */
async function reviewExceptionRequest(exceptionId, approved, reviewedBy, reviewNotes, transaction) {
    const exception = await PolicyException.findByPk(exceptionId, { transaction });
    if (!exception) {
        throw new Error(`Policy exception ${exceptionId} not found`);
    }
    exception.status = approved ? ExceptionStatus.APPROVED : ExceptionStatus.DENIED;
    exception.reviewedBy = reviewedBy;
    exception.reviewedAt = new Date();
    exception.reviewNotes = reviewNotes;
    if (approved) {
        exception.approvedAt = new Date();
    }
    await exception.save({ transaction });
    // Update violation status
    if (exception.violationId) {
        await PolicyViolation.update({
            status: approved
                ? ViolationStatus.EXCEPTION_GRANTED
                : ViolationStatus.DETECTED,
        }, { where: { id: exception.violationId }, transaction });
    }
    return exception;
}
/**
 * Check for expired exceptions
 * @param transaction Optional transaction
 * @returns Expired exceptions
 */
async function findExpiredExceptions(transaction) {
    const exceptions = await PolicyException.findAll({
        where: {
            status: ExceptionStatus.APPROVED,
            expiryDate: {
                [sequelize_1.Op.lt]: new Date(),
            },
        },
        transaction,
    });
    // Mark as expired
    for (const exception of exceptions) {
        exception.status = ExceptionStatus.EXPIRED;
        await exception.save({ transaction });
        // Reopen violation
        if (exception.violationId) {
            await PolicyViolation.update({ status: ViolationStatus.DETECTED }, { where: { id: exception.violationId }, transaction });
        }
    }
    return exceptions;
}
/**
 * Revoke exception
 * @param exceptionId Exception ID
 * @param revokedBy User ID
 * @param reason Revocation reason
 * @param transaction Optional transaction
 * @returns Updated exception
 */
async function revokeException(exceptionId, revokedBy, reason, transaction) {
    const exception = await PolicyException.findByPk(exceptionId, { transaction });
    if (!exception) {
        throw new Error(`Policy exception ${exceptionId} not found`);
    }
    exception.status = ExceptionStatus.REVOKED;
    exception.metadata = {
        ...exception.metadata,
        revokedBy,
        revokedAt: new Date().toISOString(),
        revocationReason: reason,
    };
    await exception.save({ transaction });
    // Reopen violation
    if (exception.violationId) {
        await PolicyViolation.update({ status: ViolationStatus.DETECTED }, { where: { id: exception.violationId }, transaction });
    }
    return exception;
}
// ============================================================================
// POLICY AUDIT REPORTING FUNCTIONS
// ============================================================================
/**
 * Log policy action to audit log
 * @param policyId Policy ID
 * @param action Action performed
 * @param performedBy User ID
 * @param changes Changes made
 * @param transaction Optional transaction
 * @returns Created audit log entry
 */
async function logPolicyAction(policyId, action, performedBy, changes, transaction) {
    return await PolicyAuditLog.create({
        policyId,
        action,
        performedBy,
        changes,
        timestamp: new Date(),
    }, { transaction });
}
/**
 * Generate compliance report
 * @param params Report parameters
 * @param transaction Optional transaction
 * @returns Compliance report
 */
async function generateComplianceReport(params, transaction) {
    const whereClause = {
        status: PolicyStatus.ACTIVE,
    };
    if (params.frameworks && params.frameworks.length > 0) {
        whereClause.framework = { [sequelize_1.Op.in]: params.frameworks };
    }
    if (params.categories && params.categories.length > 0) {
        whereClause.category = { [sequelize_1.Op.in]: params.categories };
    }
    const policies = await SecurityPolicy.findAll({
        where: whereClause,
        transaction,
    });
    const violations = await PolicyViolation.findAll({
        where: {
            detectedAt: {
                [sequelize_1.Op.between]: [params.startDate, params.endDate],
            },
        },
        transaction,
    });
    const compliantPolicies = policies.filter(p => p.complianceRate && p.complianceRate >= 95).length;
    const byFramework = new Map();
    const byCategory = new Map();
    for (const policy of policies) {
        // Framework aggregation
        const frameworkStats = byFramework.get(policy.framework) || { policies: 0, violations: 0 };
        frameworkStats.policies++;
        byFramework.set(policy.framework, frameworkStats);
        // Category aggregation
        const categoryStats = byCategory.get(policy.category) || { policies: 0, violations: 0 };
        categoryStats.policies++;
        byCategory.set(policy.category, categoryStats);
    }
    // Add violations to aggregations
    for (const violation of violations) {
        const policy = policies.find(p => p.id === violation.policyId);
        if (policy) {
            const frameworkStats = byFramework.get(policy.framework);
            if (frameworkStats)
                frameworkStats.violations++;
            const categoryStats = byCategory.get(policy.category);
            if (categoryStats)
                categoryStats.violations++;
        }
    }
    return {
        summary: {
            totalPolicies: policies.length,
            compliantPolicies,
            nonCompliantPolicies: policies.length - compliantPolicies,
            overallComplianceRate: policies.length > 0
                ? (compliantPolicies / policies.length) * 100
                : 0,
        },
        byFramework,
        byCategory,
        criticalViolations: violations.filter(v => v.severity === ViolationSeverity.CRITICAL).length,
        openViolations: violations.filter(v => v.status === ViolationStatus.DETECTED).length,
        remediatedViolations: violations.filter(v => v.status === ViolationStatus.REMEDIATED).length,
    };
}
/**
 * Get audit trail for policy
 * @param policyId Policy ID
 * @param startDate Start date
 * @param endDate End date
 * @param transaction Optional transaction
 * @returns Audit log entries
 */
async function getPolicyAuditTrail(policyId, startDate, endDate, transaction) {
    return await PolicyAuditLog.findAll({
        where: {
            policyId,
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['timestamp', 'DESC']],
        transaction,
    });
}
// ============================================================================
// SECURITY BASELINE ENFORCEMENT FUNCTIONS
// ============================================================================
/**
 * Define security baseline
 * @param name Baseline name
 * @param policies Policy IDs to include
 * @param transaction Optional transaction
 * @returns Baseline configuration
 */
async function defineSecurityBaseline(name, policies, transaction) {
    const baselinePolicies = await SecurityPolicy.findAll({
        where: {
            id: { [sequelize_1.Op.in]: policies },
            status: PolicyStatus.ACTIVE,
        },
        transaction,
    });
    return {
        name,
        policies: baselinePolicies,
        enforcementLevel: 'strict',
    };
}
/**
 * Validate system against security baseline
 * @param baselinePolicies Baseline policies
 * @param systemConfig System configuration
 * @returns Validation results
 */
function validateSecurityBaseline(baselinePolicies, systemConfig) {
    const passedPolicies = [];
    const failedPolicies = [];
    for (const policy of baselinePolicies) {
        const validation = validateAgainstPolicy(policy, systemConfig);
        if (validation.compliant) {
            passedPolicies.push(policy.id);
        }
        else {
            failedPolicies.push({
                policyId: policy.id,
                violations: validation.violations,
            });
        }
    }
    const complianceScore = baselinePolicies.length > 0
        ? (passedPolicies.length / baselinePolicies.length) * 100
        : 0;
    return {
        compliant: failedPolicies.length === 0,
        passedPolicies,
        failedPolicies,
        complianceScore,
    };
}
/**
 * Enforce security baseline on system
 * @param baselinePolicies Baseline policies
 * @param systemId System identifier
 * @param transaction Optional transaction
 * @returns Enforcement results
 */
async function enforceSecurityBaseline(baselinePolicies, systemId, transaction) {
    let violationsDetected = 0;
    for (const policy of baselinePolicies) {
        const violations = await PolicyViolation.findAll({
            where: {
                policyId: policy.id,
                affectedEntity: systemId,
                status: {
                    [sequelize_1.Op.notIn]: [ViolationStatus.REMEDIATED, ViolationStatus.FALSE_POSITIVE],
                },
            },
            transaction,
        });
        violationsDetected += violations.length;
        // Execute enforcement actions
        for (const violation of violations) {
            await executeEnforcementAction(violation.id, transaction);
        }
    }
    return {
        systemId,
        enforced: true,
        policiesApplied: baselinePolicies.length,
        violationsDetected,
    };
}
// ============================================================================
// CONFIGURATION COMPLIANCE FUNCTIONS
// ============================================================================
/**
 * Check configuration compliance
 * @param config Configuration to check
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance result
 */
async function checkConfigurationCompliance(config, policyId, transaction) {
    const policy = await SecurityPolicy.findByPk(policyId, { transaction });
    if (!policy) {
        throw new Error(`Security policy ${policyId} not found`);
    }
    const validation = validateAgainstPolicy(policy, config);
    const recommendations = [];
    if (!validation.compliant) {
        for (const violation of validation.violations) {
            recommendations.push(`Remediation: ${violation}`);
        }
    }
    return {
        compliant: validation.compliant,
        policyName: policy.name,
        violations: validation.violations,
        recommendations,
    };
}
/**
 * Generate configuration hardening guide
 * @param policies Policies to include
 * @returns Hardening guide
 */
function generateConfigurationHardeningGuide(policies) {
    const policyGuides = policies.map(policy => ({
        category: policy.category,
        name: policy.name,
        requirements: Object.entries(policy.rules).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
        severity: policy.severity,
    }));
    return {
        title: 'Security Configuration Hardening Guide',
        policies: policyGuides,
        summary: `This guide covers ${policies.length} security policies across ${new Set(policies.map(p => p.category)).size} categories.`,
    };
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let SecurityPolicyEnforcementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SecurityPolicyEnforcementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createPolicy(data) {
            return createSecurityPolicy(data);
        }
        async createComplianceCheck(policyId, data) {
            return createComplianceCheck(policyId, data);
        }
        async detectViolations(policyId, entities) {
            return detectPolicyViolations(policyId, entities);
        }
        async generateReport(params) {
            return generateComplianceReport(params);
        }
        async enforceBaseline(baselineName, policyIds, systemId) {
            const baseline = await defineSecurityBaseline(baselineName, policyIds);
            return enforceSecurityBaseline(baseline.policies, systemId);
        }
    };
    __setFunctionName(_classThis, "SecurityPolicyEnforcementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityPolicyEnforcementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityPolicyEnforcementService = _classThis;
})();
exports.SecurityPolicyEnforcementService = SecurityPolicyEnforcementService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    SecurityPolicy,
    ComplianceCheck,
    PolicyViolation,
    PolicyException,
    PolicyAuditLog,
    // Model initialization
    initSecurityPolicyModel,
    initComplianceCheckModel,
    initPolicyViolationModel,
    initPolicyExceptionModel,
    initPolicyAuditLogModel,
    // Policy management
    createSecurityPolicy,
    updatePolicyStatus,
    createPolicyVersion,
    getPolicyWithDetails,
    getPoliciesByFramework,
    // Compliance checking
    createComplianceCheck,
    executeComplianceCheck,
    validateAgainstPolicy,
    calculatePolicyComplianceRate,
    // Violation detection
    createPolicyViolation,
    updateViolationStatus,
    detectPolicyViolations,
    getCriticalViolations,
    // Enforcement automation
    executeEnforcementAction,
    autoRemediateViolation,
    scheduleAutomatedCheck,
    // Exception management
    createExceptionRequest,
    reviewExceptionRequest,
    findExpiredExceptions,
    revokeException,
    // Audit reporting
    logPolicyAction,
    generateComplianceReport,
    getPolicyAuditTrail,
    // Baseline enforcement
    defineSecurityBaseline,
    validateSecurityBaseline,
    enforceSecurityBaseline,
    // Configuration compliance
    checkConfigurationCompliance,
    generateConfigurationHardeningGuide,
    // Service
    SecurityPolicyEnforcementService,
};
//# sourceMappingURL=security-policy-enforcement-kit.js.map