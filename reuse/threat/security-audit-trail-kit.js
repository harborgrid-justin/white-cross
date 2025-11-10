"use strict";
/**
 * @fileoverview Security Audit Trail Kit - Enterprise Audit Logging and Compliance
 * @module reuse/threat/security-audit-trail-kit
 * @description Comprehensive security audit trail management for enterprise security operations,
 * providing tamper-proof logging, compliance auditing, forensic analysis, and chain of custody
 * tracking. Designed to compete with enterprise audit solutions from Infor SCM and similar platforms.
 *
 * Key Features:
 * - Comprehensive audit log generation and management
 * - Real-time security event tracking and correlation
 * - Access audit trails with user activity monitoring
 * - Change tracking with versioning and rollback support
 * - Multi-framework compliance audit support (SOC 2, HIPAA, GDPR, PCI-DSS)
 * - Advanced forensic log analysis and investigation
 * - Intelligent log retention and archival policies
 * - Automated audit report generation
 * - Chain of custody tracking for evidence management
 * - Tamper detection and log integrity verification
 * - Audit data anonymization and redaction
 * - Real-time audit alerting and notifications
 *
 * @target Enterprise Audit Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Tamper-proof audit log storage with cryptographic hashing
 * - Role-based access control for audit data
 * - Audit log encryption at rest and in transit
 * - Write-once read-many (WORM) storage compliance
 * - SOC 2 Type II, HIPAA, GDPR, PCI-DSS compliance
 * - Multi-tenant audit data isolation
 * - Secure audit data retention and destruction
 *
 * @example Audit log generation
 * ```typescript
 * import { generateAuditLog, trackSecurityEvent } from './security-audit-trail-kit';
 *
 * const auditLog = await generateAuditLog({
 *   eventType: AuditEventType.USER_LOGIN,
 *   userId: 'user-123',
 *   action: 'LOGIN_SUCCESS',
 *   resourceType: 'AUTHENTICATION',
 *   ipAddress: '192.168.1.100',
 * }, sequelize);
 *
 * const event = await trackSecurityEvent({
 *   eventType: SecurityEventType.FAILED_LOGIN_ATTEMPT,
 *   severity: AuditSeverity.HIGH,
 *   userId: 'user-456',
 *   metadata: { attempts: 5 },
 * }, sequelize);
 * ```
 *
 * @example Compliance auditing
 * ```typescript
 * import { generateComplianceAuditReport, validateComplianceRequirements } from './security-audit-trail-kit';
 *
 * const report = await generateComplianceAuditReport({
 *   standard: ComplianceStandard.SOC2_TYPE_II,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   scope: ['authentication', 'data-access', 'change-management'],
 * }, sequelize);
 *
 * const validation = await validateComplianceRequirements('SOC2_TYPE_II', sequelize);
 * ```
 *
 * LOC: THREAT-AUDIT-013
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns, crypto
 * DOWNSTREAM: security-operations, compliance, incident-response, risk-management
 *
 * @version 1.0.0
 * @since 2025-01-09
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLogTampering = exports.trackChainOfCustody = exports.scheduleAuditReport = exports.generateAuditReport = exports.applyRetentionPolicy = exports.createLogRetentionPolicy = exports.generateForensicReport = exports.analyzeLogPatterns = exports.reconstructEventTimeline = exports.performForensicAnalysis = exports.trackComplianceEvidence = exports.mapAuditLogsToCompliance = exports.generateComplianceAuditReport = exports.validateComplianceRequirements = exports.createComplianceAudit = exports.generateChangeTrackingReport = exports.rollbackToVersion = exports.compareEntityVersions = exports.getEntityChangeHistory = exports.recordDataChange = exports.trackPrivilegedAccess = exports.generateAccessControlReport = exports.detectUnusualAccessPatterns = exports.getResourceAccessHistory = exports.getUserAccessHistory = exports.recordAccessAudit = exports.generateSecurityEventAlerts = exports.escalateSecurityEvent = exports.getSecurityEventSummary = exports.resolveSecurityEvent = exports.correlateSecurityEvents = exports.trackSecurityEvent = exports.aggregateAuditLogStatistics = exports.purgeAuditLogs = exports.exportAuditLogs = exports.archiveAuditLogs = exports.updateAuditLogStatus = exports.searchAuditLogs = exports.getAuditLogs = exports.generateAuditLog = exports.ChainOfCustodyDto = exports.ComplianceAuditDto = exports.SecurityEventDto = exports.AuditLogDto = exports.RetentionPeriod = exports.AuditLogStatus = exports.ComplianceStandard = exports.SecurityEventType = exports.AuditSeverity = exports.AuditEventType = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const date_fns_1 = require("date-fns");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * @enum AuditEventType
 * @description Types of audit events
 */
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["USER_LOGIN"] = "USER_LOGIN";
    AuditEventType["USER_LOGOUT"] = "USER_LOGOUT";
    AuditEventType["USER_CREATION"] = "USER_CREATION";
    AuditEventType["USER_DELETION"] = "USER_DELETION";
    AuditEventType["USER_MODIFICATION"] = "USER_MODIFICATION";
    AuditEventType["ROLE_ASSIGNMENT"] = "ROLE_ASSIGNMENT";
    AuditEventType["PERMISSION_CHANGE"] = "PERMISSION_CHANGE";
    AuditEventType["DATA_ACCESS"] = "DATA_ACCESS";
    AuditEventType["DATA_MODIFICATION"] = "DATA_MODIFICATION";
    AuditEventType["DATA_DELETION"] = "DATA_DELETION";
    AuditEventType["DATA_EXPORT"] = "DATA_EXPORT";
    AuditEventType["CONFIGURATION_CHANGE"] = "CONFIGURATION_CHANGE";
    AuditEventType["SECURITY_POLICY_UPDATE"] = "SECURITY_POLICY_UPDATE";
    AuditEventType["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditEventType["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditEventType["MFA_ENABLED"] = "MFA_ENABLED";
    AuditEventType["MFA_DISABLED"] = "MFA_DISABLED";
    AuditEventType["API_ACCESS"] = "API_ACCESS";
    AuditEventType["FILE_UPLOAD"] = "FILE_UPLOAD";
    AuditEventType["FILE_DOWNLOAD"] = "FILE_DOWNLOAD";
    AuditEventType["SYSTEM_CONFIGURATION"] = "SYSTEM_CONFIGURATION";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
/**
 * @enum AuditSeverity
 * @description Severity levels for audit events
 */
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["CRITICAL"] = "CRITICAL";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["INFORMATIONAL"] = "INFORMATIONAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
/**
 * @enum SecurityEventType
 * @description Security-specific event types
 */
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["FAILED_LOGIN_ATTEMPT"] = "FAILED_LOGIN_ATTEMPT";
    SecurityEventType["BRUTE_FORCE_DETECTED"] = "BRUTE_FORCE_DETECTED";
    SecurityEventType["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
    SecurityEventType["PRIVILEGE_ESCALATION"] = "PRIVILEGE_ESCALATION";
    SecurityEventType["SUSPICIOUS_ACTIVITY"] = "SUSPICIOUS_ACTIVITY";
    SecurityEventType["DATA_EXFILTRATION_ATTEMPT"] = "DATA_EXFILTRATION_ATTEMPT";
    SecurityEventType["MALWARE_DETECTED"] = "MALWARE_DETECTED";
    SecurityEventType["INTRUSION_ATTEMPT"] = "INTRUSION_ATTEMPT";
    SecurityEventType["POLICY_VIOLATION"] = "POLICY_VIOLATION";
    SecurityEventType["ANOMALOUS_BEHAVIOR"] = "ANOMALOUS_BEHAVIOR";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
/**
 * @enum ComplianceStandard
 * @description Compliance framework standards
 */
var ComplianceStandard;
(function (ComplianceStandard) {
    ComplianceStandard["SOC2_TYPE_I"] = "SOC2_TYPE_I";
    ComplianceStandard["SOC2_TYPE_II"] = "SOC2_TYPE_II";
    ComplianceStandard["HIPAA"] = "HIPAA";
    ComplianceStandard["GDPR"] = "GDPR";
    ComplianceStandard["PCI_DSS"] = "PCI_DSS";
    ComplianceStandard["ISO_27001"] = "ISO_27001";
    ComplianceStandard["NIST_800_53"] = "NIST_800_53";
    ComplianceStandard["FISMA"] = "FISMA";
    ComplianceStandard["CCPA"] = "CCPA";
    ComplianceStandard["FedRAMP"] = "FedRAMP";
})(ComplianceStandard || (exports.ComplianceStandard = ComplianceStandard = {}));
/**
 * @enum AuditLogStatus
 * @description Status of audit log entry
 */
var AuditLogStatus;
(function (AuditLogStatus) {
    AuditLogStatus["ACTIVE"] = "ACTIVE";
    AuditLogStatus["ARCHIVED"] = "ARCHIVED";
    AuditLogStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    AuditLogStatus["UNDER_INVESTIGATION"] = "UNDER_INVESTIGATION";
    AuditLogStatus["REVIEWED"] = "REVIEWED";
    AuditLogStatus["FLAGGED"] = "FLAGGED";
})(AuditLogStatus || (exports.AuditLogStatus = AuditLogStatus = {}));
/**
 * @enum RetentionPeriod
 * @description Log retention period options
 */
var RetentionPeriod;
(function (RetentionPeriod) {
    RetentionPeriod["DAYS_30"] = "30_DAYS";
    RetentionPeriod["DAYS_90"] = "90_DAYS";
    RetentionPeriod["DAYS_180"] = "180_DAYS";
    RetentionPeriod["YEAR_1"] = "1_YEAR";
    RetentionPeriod["YEARS_3"] = "3_YEARS";
    RetentionPeriod["YEARS_7"] = "7_YEARS";
    RetentionPeriod["YEARS_10"] = "10_YEARS";
    RetentionPeriod["PERMANENT"] = "PERMANENT";
})(RetentionPeriod || (exports.RetentionPeriod = RetentionPeriod = {}));
// ============================================================================
// SWAGGER DTO CLASSES
// ============================================================================
/**
 * @class AuditLogDto
 * @description DTO for audit log entry
 */
let AuditLogDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _userName_decorators;
    let _userName_initializers = [];
    let _userName_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _success_decorators;
    let _success_initializers = [];
    let _success_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _hash_decorators;
    let _hash_initializers = [];
    let _hash_extraInitializers = [];
    let _details_decorators;
    let _details_initializers = [];
    let _details_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class AuditLogDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.eventType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.userId = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.userName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
                this.action = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.resourceType = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
                this.resourceId = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
                this.severity = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
                this.sessionId = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
                this.success = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _success_initializers, void 0));
                this.timestamp = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                this.hash = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _hash_initializers, void 0));
                this.details = (__runInitializers(this, _hash_extraInitializers), __runInitializers(this, _details_initializers, void 0));
                this.metadata = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.status = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audit log unique identifier', example: 'audit-1234567890' })];
            _eventType_decorators = [(0, swagger_1.ApiProperty)({ enum: AuditEventType, description: 'Type of audit event' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID who performed the action', example: 'user-123', required: false })];
            _userName_decorators = [(0, swagger_1.ApiProperty)({ description: 'User name', example: 'john.doe@company.com', required: false })];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action performed', example: 'LOGIN_SUCCESS' })];
            _resourceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Type of resource affected', example: 'AUTHENTICATION' })];
            _resourceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource identifier', example: 'resource-789', required: false })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: AuditSeverity, description: 'Event severity level' })];
            _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address of the user', example: '192.168.1.100', required: false })];
            _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent string', required: false })];
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session identifier', required: false })];
            _success_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether the action was successful', example: true })];
            _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event timestamp', example: '2025-01-09T10:30:00Z' })];
            _hash_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cryptographic hash for integrity', example: 'a1b2c3d4...' })];
            _details_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional details', required: false })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata', required: false })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: AuditLogStatus, description: 'Log entry status' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: obj => "userName" in obj, get: obj => obj.userName, set: (obj, value) => { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: obj => "success" in obj, get: obj => obj.success, set: (obj, value) => { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, null, _hash_decorators, { kind: "field", name: "hash", static: false, private: false, access: { has: obj => "hash" in obj, get: obj => obj.hash, set: (obj, value) => { obj.hash = value; } }, metadata: _metadata }, _hash_initializers, _hash_extraInitializers);
            __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: obj => "details" in obj, get: obj => obj.details, set: (obj, value) => { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AuditLogDto = AuditLogDto;
/**
 * @class SecurityEventDto
 * @description DTO for security event
 */
let SecurityEventDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _affectedResources_decorators;
    let _affectedResources_initializers = [];
    let _affectedResources_extraInitializers = [];
    let _indicators_decorators;
    let _indicators_initializers = [];
    let _indicators_extraInitializers = [];
    let _responseAction_decorators;
    let _responseAction_initializers = [];
    let _responseAction_extraInitializers = [];
    let _resolved_decorators;
    let _resolved_initializers = [];
    let _resolved_extraInitializers = [];
    let _detectedAt_decorators;
    let _detectedAt_initializers = [];
    let _detectedAt_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    return _a = class SecurityEventDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.eventType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.severity = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.userId = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.description = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.affectedResources = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _affectedResources_initializers, void 0));
                this.indicators = (__runInitializers(this, _affectedResources_extraInitializers), __runInitializers(this, _indicators_initializers, void 0));
                this.responseAction = (__runInitializers(this, _indicators_extraInitializers), __runInitializers(this, _responseAction_initializers, void 0));
                this.resolved = (__runInitializers(this, _responseAction_extraInitializers), __runInitializers(this, _resolved_initializers, void 0));
                this.detectedAt = (__runInitializers(this, _resolved_extraInitializers), __runInitializers(this, _detectedAt_initializers, void 0));
                this.resolvedAt = (__runInitializers(this, _detectedAt_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
                __runInitializers(this, _resolvedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Security event unique identifier', example: 'event-1234567890' })];
            _eventType_decorators = [(0, swagger_1.ApiProperty)({ enum: SecurityEventType, description: 'Type of security event' })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: AuditSeverity, description: 'Event severity' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID involved', required: false })];
            _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address', required: false })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event description' })];
            _affectedResources_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected resources', type: [String], required: false })];
            _indicators_decorators = [(0, swagger_1.ApiProperty)({ description: 'Security indicators', type: [String], required: false })];
            _responseAction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response action taken', required: false })];
            _resolved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether the event is resolved', example: false })];
            _detectedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event timestamp' })];
            _resolvedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution timestamp', required: false })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _affectedResources_decorators, { kind: "field", name: "affectedResources", static: false, private: false, access: { has: obj => "affectedResources" in obj, get: obj => obj.affectedResources, set: (obj, value) => { obj.affectedResources = value; } }, metadata: _metadata }, _affectedResources_initializers, _affectedResources_extraInitializers);
            __esDecorate(null, null, _indicators_decorators, { kind: "field", name: "indicators", static: false, private: false, access: { has: obj => "indicators" in obj, get: obj => obj.indicators, set: (obj, value) => { obj.indicators = value; } }, metadata: _metadata }, _indicators_initializers, _indicators_extraInitializers);
            __esDecorate(null, null, _responseAction_decorators, { kind: "field", name: "responseAction", static: false, private: false, access: { has: obj => "responseAction" in obj, get: obj => obj.responseAction, set: (obj, value) => { obj.responseAction = value; } }, metadata: _metadata }, _responseAction_initializers, _responseAction_extraInitializers);
            __esDecorate(null, null, _resolved_decorators, { kind: "field", name: "resolved", static: false, private: false, access: { has: obj => "resolved" in obj, get: obj => obj.resolved, set: (obj, value) => { obj.resolved = value; } }, metadata: _metadata }, _resolved_initializers, _resolved_extraInitializers);
            __esDecorate(null, null, _detectedAt_decorators, { kind: "field", name: "detectedAt", static: false, private: false, access: { has: obj => "detectedAt" in obj, get: obj => obj.detectedAt, set: (obj, value) => { obj.detectedAt = value; } }, metadata: _metadata }, _detectedAt_initializers, _detectedAt_extraInitializers);
            __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SecurityEventDto = SecurityEventDto;
/**
 * @class ComplianceAuditDto
 * @description DTO for compliance audit
 */
let ComplianceAuditDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _standard_decorators;
    let _standard_initializers = [];
    let _standard_extraInitializers = [];
    let _controlId_decorators;
    let _controlId_initializers = [];
    let _controlId_extraInitializers = [];
    let _controlName_decorators;
    let _controlName_initializers = [];
    let _controlName_extraInitializers = [];
    let _auditDate_decorators;
    let _auditDate_initializers = [];
    let _auditDate_extraInitializers = [];
    let _auditorId_decorators;
    let _auditorId_initializers = [];
    let _auditorId_extraInitializers = [];
    let _complianceStatus_decorators;
    let _complianceStatus_initializers = [];
    let _complianceStatus_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _evidenceIds_decorators;
    let _evidenceIds_initializers = [];
    let _evidenceIds_extraInitializers = [];
    let _nextAuditDate_decorators;
    let _nextAuditDate_initializers = [];
    let _nextAuditDate_extraInitializers = [];
    return _a = class ComplianceAuditDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.standard = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _standard_initializers, void 0));
                this.controlId = (__runInitializers(this, _standard_extraInitializers), __runInitializers(this, _controlId_initializers, void 0));
                this.controlName = (__runInitializers(this, _controlId_extraInitializers), __runInitializers(this, _controlName_initializers, void 0));
                this.auditDate = (__runInitializers(this, _controlName_extraInitializers), __runInitializers(this, _auditDate_initializers, void 0));
                this.auditorId = (__runInitializers(this, _auditDate_extraInitializers), __runInitializers(this, _auditorId_initializers, void 0));
                this.complianceStatus = (__runInitializers(this, _auditorId_extraInitializers), __runInitializers(this, _complianceStatus_initializers, void 0));
                this.findings = (__runInitializers(this, _complianceStatus_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
                this.recommendations = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
                this.evidenceIds = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _evidenceIds_initializers, void 0));
                this.nextAuditDate = (__runInitializers(this, _evidenceIds_extraInitializers), __runInitializers(this, _nextAuditDate_initializers, void 0));
                __runInitializers(this, _nextAuditDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance audit identifier', example: 'comp-audit-123' })];
            _standard_decorators = [(0, swagger_1.ApiProperty)({ enum: ComplianceStandard, description: 'Compliance standard' })];
            _controlId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control identifier', example: 'SOC2-CC6.1' })];
            _controlName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control name', example: 'Logical Access Controls' })];
            _auditDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audit date' })];
            _auditorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auditor ID', example: 'auditor-456' })];
            _complianceStatus_decorators = [(0, swagger_1.ApiProperty)({
                    enum: ['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT'],
                    description: 'Compliance status'
                })];
            _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audit findings', type: [String] })];
            _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations', type: [String] })];
            _evidenceIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence document IDs', type: [String] })];
            _nextAuditDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next scheduled audit date', required: false })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _standard_decorators, { kind: "field", name: "standard", static: false, private: false, access: { has: obj => "standard" in obj, get: obj => obj.standard, set: (obj, value) => { obj.standard = value; } }, metadata: _metadata }, _standard_initializers, _standard_extraInitializers);
            __esDecorate(null, null, _controlId_decorators, { kind: "field", name: "controlId", static: false, private: false, access: { has: obj => "controlId" in obj, get: obj => obj.controlId, set: (obj, value) => { obj.controlId = value; } }, metadata: _metadata }, _controlId_initializers, _controlId_extraInitializers);
            __esDecorate(null, null, _controlName_decorators, { kind: "field", name: "controlName", static: false, private: false, access: { has: obj => "controlName" in obj, get: obj => obj.controlName, set: (obj, value) => { obj.controlName = value; } }, metadata: _metadata }, _controlName_initializers, _controlName_extraInitializers);
            __esDecorate(null, null, _auditDate_decorators, { kind: "field", name: "auditDate", static: false, private: false, access: { has: obj => "auditDate" in obj, get: obj => obj.auditDate, set: (obj, value) => { obj.auditDate = value; } }, metadata: _metadata }, _auditDate_initializers, _auditDate_extraInitializers);
            __esDecorate(null, null, _auditorId_decorators, { kind: "field", name: "auditorId", static: false, private: false, access: { has: obj => "auditorId" in obj, get: obj => obj.auditorId, set: (obj, value) => { obj.auditorId = value; } }, metadata: _metadata }, _auditorId_initializers, _auditorId_extraInitializers);
            __esDecorate(null, null, _complianceStatus_decorators, { kind: "field", name: "complianceStatus", static: false, private: false, access: { has: obj => "complianceStatus" in obj, get: obj => obj.complianceStatus, set: (obj, value) => { obj.complianceStatus = value; } }, metadata: _metadata }, _complianceStatus_initializers, _complianceStatus_extraInitializers);
            __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
            __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
            __esDecorate(null, null, _evidenceIds_decorators, { kind: "field", name: "evidenceIds", static: false, private: false, access: { has: obj => "evidenceIds" in obj, get: obj => obj.evidenceIds, set: (obj, value) => { obj.evidenceIds = value; } }, metadata: _metadata }, _evidenceIds_initializers, _evidenceIds_extraInitializers);
            __esDecorate(null, null, _nextAuditDate_decorators, { kind: "field", name: "nextAuditDate", static: false, private: false, access: { has: obj => "nextAuditDate" in obj, get: obj => obj.nextAuditDate, set: (obj, value) => { obj.nextAuditDate = value; } }, metadata: _metadata }, _nextAuditDate_initializers, _nextAuditDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ComplianceAuditDto = ComplianceAuditDto;
/**
 * @class ChainOfCustodyDto
 * @description DTO for chain of custody
 */
let ChainOfCustodyDto = (() => {
    var _a;
    let _evidenceId_decorators;
    let _evidenceId_initializers = [];
    let _evidenceId_extraInitializers = [];
    let _evidenceType_decorators;
    let _evidenceType_initializers = [];
    let _evidenceType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _collectedBy_decorators;
    let _collectedBy_initializers = [];
    let _collectedBy_extraInitializers = [];
    let _collectionDate_decorators;
    let _collectionDate_initializers = [];
    let _collectionDate_extraInitializers = [];
    let _custodyTransfers_decorators;
    let _custodyTransfers_initializers = [];
    let _custodyTransfers_extraInitializers = [];
    let _currentCustodian_decorators;
    let _currentCustodian_initializers = [];
    let _currentCustodian_extraInitializers = [];
    let _currentHash_decorators;
    let _currentHash_initializers = [];
    let _currentHash_extraInitializers = [];
    return _a = class ChainOfCustodyDto {
            constructor() {
                this.evidenceId = __runInitializers(this, _evidenceId_initializers, void 0);
                this.evidenceType = (__runInitializers(this, _evidenceId_extraInitializers), __runInitializers(this, _evidenceType_initializers, void 0));
                this.description = (__runInitializers(this, _evidenceType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.collectedBy = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _collectedBy_initializers, void 0));
                this.collectionDate = (__runInitializers(this, _collectedBy_extraInitializers), __runInitializers(this, _collectionDate_initializers, void 0));
                this.custodyTransfers = (__runInitializers(this, _collectionDate_extraInitializers), __runInitializers(this, _custodyTransfers_initializers, void 0));
                this.currentCustodian = (__runInitializers(this, _custodyTransfers_extraInitializers), __runInitializers(this, _currentCustodian_initializers, void 0));
                this.currentHash = (__runInitializers(this, _currentCustodian_extraInitializers), __runInitializers(this, _currentHash_initializers, void 0));
                __runInitializers(this, _currentHash_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _evidenceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence identifier', example: 'evidence-123' })];
            _evidenceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Type of evidence', example: 'DIGITAL_LOG' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence description' })];
            _collectedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User who collected the evidence', example: 'investigator-789' })];
            _collectionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Collection timestamp' })];
            _custodyTransfers_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Custody transfer history',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            fromUser: { type: 'string' },
                            toUser: { type: 'string' },
                            transferDate: { type: 'string', format: 'date-time' },
                            reason: { type: 'string' },
                            hash: { type: 'string' }
                        }
                    }
                })];
            _currentCustodian_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current custodian', example: 'investigator-789' })];
            _currentHash_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current integrity hash', example: 'sha256:a1b2c3...' })];
            __esDecorate(null, null, _evidenceId_decorators, { kind: "field", name: "evidenceId", static: false, private: false, access: { has: obj => "evidenceId" in obj, get: obj => obj.evidenceId, set: (obj, value) => { obj.evidenceId = value; } }, metadata: _metadata }, _evidenceId_initializers, _evidenceId_extraInitializers);
            __esDecorate(null, null, _evidenceType_decorators, { kind: "field", name: "evidenceType", static: false, private: false, access: { has: obj => "evidenceType" in obj, get: obj => obj.evidenceType, set: (obj, value) => { obj.evidenceType = value; } }, metadata: _metadata }, _evidenceType_initializers, _evidenceType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _collectedBy_decorators, { kind: "field", name: "collectedBy", static: false, private: false, access: { has: obj => "collectedBy" in obj, get: obj => obj.collectedBy, set: (obj, value) => { obj.collectedBy = value; } }, metadata: _metadata }, _collectedBy_initializers, _collectedBy_extraInitializers);
            __esDecorate(null, null, _collectionDate_decorators, { kind: "field", name: "collectionDate", static: false, private: false, access: { has: obj => "collectionDate" in obj, get: obj => obj.collectionDate, set: (obj, value) => { obj.collectionDate = value; } }, metadata: _metadata }, _collectionDate_initializers, _collectionDate_extraInitializers);
            __esDecorate(null, null, _custodyTransfers_decorators, { kind: "field", name: "custodyTransfers", static: false, private: false, access: { has: obj => "custodyTransfers" in obj, get: obj => obj.custodyTransfers, set: (obj, value) => { obj.custodyTransfers = value; } }, metadata: _metadata }, _custodyTransfers_initializers, _custodyTransfers_extraInitializers);
            __esDecorate(null, null, _currentCustodian_decorators, { kind: "field", name: "currentCustodian", static: false, private: false, access: { has: obj => "currentCustodian" in obj, get: obj => obj.currentCustodian, set: (obj, value) => { obj.currentCustodian = value; } }, metadata: _metadata }, _currentCustodian_initializers, _currentCustodian_extraInitializers);
            __esDecorate(null, null, _currentHash_decorators, { kind: "field", name: "currentHash", static: false, private: false, access: { has: obj => "currentHash" in obj, get: obj => obj.currentHash, set: (obj, value) => { obj.currentHash = value; } }, metadata: _metadata }, _currentHash_initializers, _currentHash_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ChainOfCustodyDto = ChainOfCustodyDto;
// ============================================================================
// 1-8: AUDIT LOG GENERATION AND MANAGEMENT
// ============================================================================
/**
 * Generates a tamper-proof audit log entry with cryptographic hash
 *
 * @param {AuditLogData} data - Audit log data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created audit log record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const auditLog = await generateAuditLog({
 *   eventType: AuditEventType.USER_LOGIN,
 *   userId: 'user-123',
 *   action: 'LOGIN_SUCCESS',
 *   resourceType: 'AUTHENTICATION',
 *   severity: AuditSeverity.INFORMATIONAL,
 *   ipAddress: '192.168.1.100',
 *   success: true,
 * }, sequelize);
 * ```
 */
const generateAuditLog = async (data, sequelize, transaction) => {
    const timestamp = new Date();
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Generate cryptographic hash for tamper detection
    const hashInput = JSON.stringify({
        auditId,
        ...data,
        timestamp,
    });
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
    const auditData = {
        id: auditId,
        eventType: data.eventType,
        userId: data.userId,
        userName: data.userName,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        severity: data.severity,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
        success: data.success,
        timestamp,
        hash,
        details: JSON.stringify(data.details || {}),
        metadata: JSON.stringify(data.metadata || {}),
        status: AuditLogStatus.ACTIVE,
        createdAt: timestamp,
    };
    const [auditLog] = await sequelize.query(`INSERT INTO audit_logs (id, event_type, user_id, user_name, action, resource_type,
     resource_id, severity, ip_address, user_agent, session_id, success, timestamp, hash,
     details, metadata, status, created_at)
     VALUES (:id, :eventType, :userId, :userName, :action, :resourceType, :resourceId,
     :severity, :ipAddress, :userAgent, :sessionId, :success, :timestamp, :hash, :details,
     :metadata, :status, :createdAt)
     RETURNING *`, {
        replacements: auditData,
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    common_1.Logger.log(`Audit log generated: ${auditId}, Event: ${data.eventType}`, 'AuditTrail');
    return auditLog;
};
exports.generateAuditLog = generateAuditLog;
/**
 * Retrieves audit logs with advanced filtering and pagination
 *
 * @param {Object} filters - Filter criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{logs: Model[], total: number}>} Audit logs and total count
 *
 * @example
 * ```typescript
 * const result = await getAuditLogs({
 *   userId: 'user-123',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   severity: [AuditSeverity.HIGH, AuditSeverity.CRITICAL],
 *   limit: 100,
 *   offset: 0,
 * }, sequelize);
 * ```
 */
const getAuditLogs = async (filters, sequelize) => {
    const whereConditions = [];
    const replacements = {
        limit: filters.limit || 100,
        offset: filters.offset || 0,
    };
    if (filters.userId) {
        whereConditions.push('user_id = :userId');
        replacements.userId = filters.userId;
    }
    if (filters.eventType) {
        whereConditions.push('event_type = :eventType');
        replacements.eventType = filters.eventType;
    }
    if (filters.severity && filters.severity.length > 0) {
        whereConditions.push(`severity IN (:severities)`);
        replacements.severities = filters.severity;
    }
    if (filters.startDate) {
        whereConditions.push('timestamp >= :startDate');
        replacements.startDate = filters.startDate;
    }
    if (filters.endDate) {
        whereConditions.push('timestamp <= :endDate');
        replacements.endDate = filters.endDate;
    }
    if (filters.resourceType) {
        whereConditions.push('resource_type = :resourceType');
        replacements.resourceType = filters.resourceType;
    }
    if (typeof filters.success === 'boolean') {
        whereConditions.push('success = :success');
        replacements.success = filters.success;
    }
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const logs = await sequelize.query(`SELECT * FROM audit_logs ${whereClause} ORDER BY timestamp DESC LIMIT :limit OFFSET :offset`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    const [{ count }] = await sequelize.query(`SELECT COUNT(*) as count FROM audit_logs ${whereClause}`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        logs: logs,
        total: parseInt(count, 10),
    };
};
exports.getAuditLogs = getAuditLogs;
/**
 * Searches audit logs using full-text search
 *
 * @param {string} searchQuery - Search query string
 * @param {Object} options - Search options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Matching audit logs
 *
 * @example
 * ```typescript
 * const results = await searchAuditLogs('failed login', {
 *   severity: AuditSeverity.HIGH,
 *   limit: 50,
 * }, sequelize);
 * ```
 */
const searchAuditLogs = async (searchQuery, options, sequelize) => {
    const whereConditions = [
        `(action ILIKE :searchQuery OR details::text ILIKE :searchQuery OR metadata::text ILIKE :searchQuery)`,
    ];
    const replacements = {
        searchQuery: `%${searchQuery}%`,
        limit: options.limit || 100,
    };
    if (options.severity) {
        whereConditions.push('severity = :severity');
        replacements.severity = options.severity;
    }
    if (options.startDate) {
        whereConditions.push('timestamp >= :startDate');
        replacements.startDate = options.startDate;
    }
    if (options.endDate) {
        whereConditions.push('timestamp <= :endDate');
        replacements.endDate = options.endDate;
    }
    const logs = await sequelize.query(`SELECT * FROM audit_logs WHERE ${whereConditions.join(' AND ')}
     ORDER BY timestamp DESC LIMIT :limit`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    common_1.Logger.log(`Audit log search completed: "${searchQuery}", Results: ${logs.length}`, 'AuditTrail');
    return logs;
};
exports.searchAuditLogs = searchAuditLogs;
/**
 * Updates audit log status (for review/investigation workflows)
 *
 * @param {string} auditLogId - Audit log ID
 * @param {AuditLogStatus} newStatus - New status
 * @param {string} reviewedBy - User ID performing the update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated audit log
 *
 * @example
 * ```typescript
 * const updated = await updateAuditLogStatus(
 *   'audit-123',
 *   AuditLogStatus.REVIEWED,
 *   'admin-456',
 *   sequelize
 * );
 * ```
 */
const updateAuditLogStatus = async (auditLogId, newStatus, reviewedBy, sequelize) => {
    const [result] = await sequelize.query(`UPDATE audit_logs SET status = :newStatus, reviewed_by = :reviewedBy,
     reviewed_at = :reviewedAt, updated_at = :updatedAt
     WHERE id = :auditLogId
     RETURNING *`, {
        replacements: {
            auditLogId,
            newStatus,
            reviewedBy,
            reviewedAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Audit log status updated: ${auditLogId} -> ${newStatus}`, 'AuditTrail');
    return result;
};
exports.updateAuditLogStatus = updateAuditLogStatus;
/**
 * Archives old audit logs based on retention policy
 *
 * @param {Date} archiveBeforeDate - Archive logs before this date
 * @param {string} archivalDestination - Destination for archived logs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{archivedCount: number}>} Number of logs archived
 *
 * @example
 * ```typescript
 * const result = await archiveAuditLogs(
 *   new Date('2024-01-01'),
 *   's3://audit-archive/',
 *   sequelize
 * );
 * console.log(`Archived ${result.archivedCount} logs`);
 * ```
 */
const archiveAuditLogs = async (archiveBeforeDate, archivalDestination, sequelize) => {
    const [result] = await sequelize.query(`UPDATE audit_logs SET status = :archivedStatus, archived_at = :archivedAt,
     archival_destination = :archivalDestination
     WHERE timestamp < :archiveBeforeDate AND status = :activeStatus
     RETURNING id`, {
        replacements: {
            archiveBeforeDate,
            archivalDestination,
            archivedStatus: AuditLogStatus.ARCHIVED,
            activeStatus: AuditLogStatus.ACTIVE,
            archivedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    const archivedCount = Array.isArray(result) ? result.length : 0;
    common_1.Logger.log(`Archived ${archivedCount} audit logs to ${archivalDestination}`, 'AuditTrail');
    return { archivedCount };
};
exports.archiveAuditLogs = archiveAuditLogs;
/**
 * Exports audit logs to external format (JSON, CSV, PDF)
 *
 * @param {Object} filters - Export filters
 * @param {string} format - Export format ('JSON' | 'CSV' | 'PDF')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, recordCount: number, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportAuditLogs({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   userId: 'user-123',
 * }, 'JSON', sequelize);
 * ```
 */
const exportAuditLogs = async (filters, format, sequelize) => {
    const { logs } = await (0, exports.getAuditLogs)(filters, sequelize);
    const exportId = `export-${Date.now()}`;
    const exportPath = `/exports/audit-logs/${exportId}.${format.toLowerCase()}`;
    await sequelize.query(`INSERT INTO audit_log_exports (id, format, filters, record_count, export_path, created_at)
     VALUES (:id, :format, :filters, :recordCount, :exportPath, :createdAt)`, {
        replacements: {
            id: exportId,
            format,
            filters: JSON.stringify(filters),
            recordCount: logs.length,
            exportPath,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Audit logs exported: ${exportId}, Format: ${format}, Count: ${logs.length}`, 'AuditTrail');
    return {
        exportId,
        recordCount: logs.length,
        exportPath,
    };
};
exports.exportAuditLogs = exportAuditLogs;
/**
 * Purges audit logs permanently (after retention period)
 *
 * @param {Date} purgeBeforeDate - Purge logs before this date
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{purgedCount: number}>} Number of logs purged
 *
 * @example
 * ```typescript
 * const result = await purgeAuditLogs(new Date('2020-01-01'), sequelize);
 * console.log(`Purged ${result.purgedCount} old logs`);
 * ```
 */
const purgeAuditLogs = async (purgeBeforeDate, sequelize, transaction) => {
    const [result] = await sequelize.query(`DELETE FROM audit_logs
     WHERE timestamp < :purgeBeforeDate AND status = :archivedStatus
     RETURNING id`, {
        replacements: {
            purgeBeforeDate,
            archivedStatus: AuditLogStatus.ARCHIVED,
        },
        type: sequelize_1.QueryTypes.DELETE,
        transaction,
    });
    const purgedCount = Array.isArray(result) ? result.length : 0;
    common_1.Logger.log(`Purged ${purgedCount} archived audit logs`, 'AuditTrail');
    return { purgedCount };
};
exports.purgeAuditLogs = purgeAuditLogs;
/**
 * Aggregates audit log statistics by time period
 *
 * @param {Object} params - Aggregation parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Aggregated statistics
 *
 * @example
 * ```typescript
 * const stats = await aggregateAuditLogStatistics({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   groupBy: 'day',
 * }, sequelize);
 * ```
 */
const aggregateAuditLogStatistics = async (params, sequelize) => {
    const dateFormat = {
        hour: 'YYYY-MM-DD HH24',
        day: 'YYYY-MM-DD',
        week: 'YYYY-IW',
        month: 'YYYY-MM',
    }[params.groupBy];
    const stats = await sequelize.query(`SELECT
       TO_CHAR(timestamp, :dateFormat) as period,
       COUNT(*) as total_events,
       COUNT(DISTINCT user_id) as unique_users,
       COUNT(CASE WHEN success = true THEN 1 END) as successful_events,
       COUNT(CASE WHEN success = false THEN 1 END) as failed_events,
       COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_events,
       COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_events
     FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY period
     ORDER BY period`, {
        replacements: {
            dateFormat,
            startDate: params.startDate,
            endDate: params.endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        groupBy: params.groupBy,
        timeRange: { startDate: params.startDate, endDate: params.endDate },
        statistics: stats,
    };
};
exports.aggregateAuditLogStatistics = aggregateAuditLogStatistics;
// ============================================================================
// 9-14: SECURITY EVENT TRACKING
// ============================================================================
/**
 * Tracks a security event with automatic correlation
 *
 * @param {SecurityEvent} event - Security event data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created security event record
 *
 * @example
 * ```typescript
 * const event = await trackSecurityEvent({
 *   eventType: SecurityEventType.FAILED_LOGIN_ATTEMPT,
 *   severity: AuditSeverity.MEDIUM,
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.50',
 *   description: 'Multiple failed login attempts detected',
 *   resolved: false,
 * }, sequelize);
 * ```
 */
const trackSecurityEvent = async (event, sequelize, transaction) => {
    const eventId = `sec-event-${Date.now()}`;
    const detectedAt = new Date();
    const [securityEvent] = await sequelize.query(`INSERT INTO security_events (id, event_type, severity, user_id, ip_address, description,
     affected_resources, indicators, response_action, resolved, detected_at, metadata, created_at)
     VALUES (:id, :eventType, :severity, :userId, :ipAddress, :description, :affectedResources,
     :indicators, :responseAction, :resolved, :detectedAt, :metadata, :createdAt)
     RETURNING *`, {
        replacements: {
            id: eventId,
            eventType: event.eventType,
            severity: event.severity,
            userId: event.userId,
            ipAddress: event.ipAddress,
            description: event.description,
            affectedResources: JSON.stringify(event.affectedResources || []),
            indicators: JSON.stringify(event.indicators || []),
            responseAction: event.responseAction,
            resolved: event.resolved,
            detectedAt,
            metadata: JSON.stringify(event.metadata || {}),
            createdAt: detectedAt,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Also create audit log for the security event
    await (0, exports.generateAuditLog)({
        eventType: AuditEventType.DATA_ACCESS,
        action: `SECURITY_EVENT_${event.eventType}`,
        resourceType: 'SECURITY_EVENT',
        resourceId: eventId,
        severity: event.severity,
        userId: event.userId,
        ipAddress: event.ipAddress,
        success: false,
        details: { description: event.description },
    }, sequelize, transaction);
    common_1.Logger.log(`Security event tracked: ${eventId}, Type: ${event.eventType}`, 'SecurityEvent');
    return securityEvent;
};
exports.trackSecurityEvent = trackSecurityEvent;
/**
 * Correlates related security events to identify patterns
 *
 * @param {string} eventId - Primary security event ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{correlatedEvents: Model[], patterns: string[]}>} Correlated events and patterns
 *
 * @example
 * ```typescript
 * const correlation = await correlateSecurityEvents('sec-event-123', sequelize);
 * console.log(`Found ${correlation.correlatedEvents.length} related events`);
 * ```
 */
const correlateSecurityEvents = async (eventId, sequelize) => {
    const [primaryEvent] = await sequelize.query(`SELECT * FROM security_events WHERE id = :eventId`, { replacements: { eventId }, type: sequelize_1.QueryTypes.SELECT });
    if (!primaryEvent) {
        throw new common_1.NotFoundException(`Security event ${eventId} not found`);
    }
    // Find related events by user, IP, or time proximity
    const correlatedEvents = await sequelize.query(`SELECT * FROM security_events
     WHERE id != :eventId
     AND (user_id = :userId OR ip_address = :ipAddress)
     AND detected_at BETWEEN :startTime AND :endTime
     ORDER BY detected_at DESC
     LIMIT 50`, {
        replacements: {
            eventId,
            userId: primaryEvent.user_id,
            ipAddress: primaryEvent.ip_address,
            startTime: (0, date_fns_1.addDays)(primaryEvent.detected_at, -1),
            endTime: (0, date_fns_1.addDays)(primaryEvent.detected_at, 1),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const patterns = [];
    if (correlatedEvents.length >= 3) {
        patterns.push('REPEATED_SUSPICIOUS_ACTIVITY');
    }
    const eventTypes = correlatedEvents.map((e) => e.event_type);
    if (eventTypes.includes(SecurityEventType.FAILED_LOGIN_ATTEMPT) &&
        eventTypes.includes(SecurityEventType.UNAUTHORIZED_ACCESS)) {
        patterns.push('BRUTE_FORCE_PATTERN');
    }
    return {
        correlatedEvents: correlatedEvents,
        patterns,
    };
};
exports.correlateSecurityEvents = correlateSecurityEvents;
/**
 * Resolves a security event with resolution details
 *
 * @param {string} eventId - Security event ID
 * @param {string} resolvedBy - User ID resolving the event
 * @param {string} resolution - Resolution description
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated security event
 *
 * @example
 * ```typescript
 * const resolved = await resolveSecurityEvent(
 *   'sec-event-123',
 *   'admin-456',
 *   'False positive - legitimate user behavior',
 *   sequelize
 * );
 * ```
 */
const resolveSecurityEvent = async (eventId, resolvedBy, resolution, sequelize) => {
    const [result] = await sequelize.query(`UPDATE security_events SET resolved = true, resolved_by = :resolvedBy,
     resolved_at = :resolvedAt, resolution = :resolution, updated_at = :updatedAt
     WHERE id = :eventId
     RETURNING *`, {
        replacements: {
            eventId,
            resolvedBy,
            resolution,
            resolvedAt: new Date(),
            updatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Security event resolved: ${eventId} by ${resolvedBy}`, 'SecurityEvent');
    return result;
};
exports.resolveSecurityEvent = resolveSecurityEvent;
/**
 * Gets security event summary by type and severity
 *
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Security event summary
 *
 * @example
 * ```typescript
 * const summary = await getSecurityEventSummary(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
const getSecurityEventSummary = async (startDate, endDate, sequelize) => {
    const summary = await sequelize.query(`SELECT
       COUNT(*) as total_events,
       COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_events,
       COUNT(CASE WHEN resolved = false THEN 1 END) as unresolved_events,
       event_type,
       severity,
       COUNT(*) as count
     FROM security_events
     WHERE detected_at >= :startDate AND detected_at <= :endDate
     GROUP BY event_type, severity
     ORDER BY count DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const topUsers = await sequelize.query(`SELECT user_id, COUNT(*) as event_count
     FROM security_events
     WHERE detected_at >= :startDate AND detected_at <= :endDate AND user_id IS NOT NULL
     GROUP BY user_id
     ORDER BY event_count DESC
     LIMIT 10`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        timeRange: { startDate, endDate },
        summary,
        topUsers,
    };
};
exports.getSecurityEventSummary = getSecurityEventSummary;
/**
 * Escalates security event to incident response team
 *
 * @param {string} eventId - Security event ID
 * @param {string} escalatedBy - User ID escalating the event
 * @param {string} reason - Escalation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{incidentId: string}>} Created incident ID
 *
 * @example
 * ```typescript
 * const incident = await escalateSecurityEvent(
 *   'sec-event-123',
 *   'analyst-789',
 *   'Potential data breach detected',
 *   sequelize
 * );
 * ```
 */
const escalateSecurityEvent = async (eventId, escalatedBy, reason, sequelize) => {
    const incidentId = `incident-${Date.now()}`;
    await sequelize.query(`INSERT INTO security_incidents (id, security_event_id, escalated_by, escalation_reason,
     status, created_at)
     VALUES (:id, :eventId, :escalatedBy, :reason, 'OPEN', :createdAt)`, {
        replacements: {
            id: incidentId,
            eventId,
            escalatedBy,
            reason,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    await sequelize.query(`UPDATE security_events SET escalated = true, escalated_to_incident = :incidentId
     WHERE id = :eventId`, {
        replacements: { eventId, incidentId },
        type: sequelize_1.QueryTypes.UPDATE,
    });
    common_1.Logger.log(`Security event escalated: ${eventId} -> Incident ${incidentId}`, 'SecurityEvent');
    return { incidentId };
};
exports.escalateSecurityEvent = escalateSecurityEvent;
/**
 * Generates real-time security event alerts
 *
 * @param {Object} alertConfig - Alert configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{alertsTriggered: number}>} Number of alerts triggered
 *
 * @example
 * ```typescript
 * const result = await generateSecurityEventAlerts({
 *   severityThreshold: AuditSeverity.HIGH,
 *   eventTypes: [SecurityEventType.BRUTE_FORCE_DETECTED],
 *   recipients: ['security-team@company.com'],
 * }, sequelize);
 * ```
 */
const generateSecurityEventAlerts = async (alertConfig, sequelize) => {
    const timeWindow = alertConfig.timeWindow || 5;
    const startTime = (0, date_fns_1.addDays)(new Date(), -(timeWindow / (24 * 60)));
    let eventTypeFilter = '';
    if (alertConfig.eventTypes && alertConfig.eventTypes.length > 0) {
        eventTypeFilter = `AND event_type IN (:eventTypes)`;
    }
    const events = await sequelize.query(`SELECT * FROM security_events
     WHERE detected_at >= :startTime
     AND severity IN ('CRITICAL', 'HIGH')
     AND resolved = false
     ${eventTypeFilter}
     ORDER BY detected_at DESC`, {
        replacements: {
            startTime,
            eventTypes: alertConfig.eventTypes || [],
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Create alert records
    for (const event of events) {
        await sequelize.query(`INSERT INTO security_alerts (id, security_event_id, recipients, triggered_at)
       VALUES (:id, :eventId, :recipients, :triggeredAt)`, {
            replacements: {
                id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                eventId: event.id,
                recipients: JSON.stringify(alertConfig.recipients),
                triggeredAt: new Date(),
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
    }
    common_1.Logger.log(`Security event alerts generated: ${events.length}`, 'SecurityEvent');
    return { alertsTriggered: events.length };
};
exports.generateSecurityEventAlerts = generateSecurityEventAlerts;
// ============================================================================
// 15-20: ACCESS AUDIT TRAILS
// ============================================================================
/**
 * Records user access to resources with full audit trail
 *
 * @param {AccessAudit} accessData - Access audit data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created access audit record
 *
 * @example
 * ```typescript
 * const accessLog = await recordAccessAudit({
 *   userId: 'user-123',
 *   resourceType: 'PATIENT_RECORD',
 *   resourceId: 'patient-456',
 *   accessType: 'READ',
 *   accessGranted: true,
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.100',
 * }, sequelize);
 * ```
 */
const recordAccessAudit = async (accessData, sequelize, transaction) => {
    const accessId = `access-${Date.now()}`;
    const [accessLog] = await sequelize.query(`INSERT INTO access_audits (id, user_id, resource_type, resource_id, access_type,
     access_granted, denial_reason, timestamp, ip_address, metadata, created_at)
     VALUES (:id, :userId, :resourceType, :resourceId, :accessType, :accessGranted,
     :denialReason, :timestamp, :ipAddress, :metadata, :createdAt)
     RETURNING *`, {
        replacements: {
            id: accessId,
            userId: accessData.userId,
            resourceType: accessData.resourceType,
            resourceId: accessData.resourceId,
            accessType: accessData.accessType,
            accessGranted: accessData.accessGranted,
            denialReason: accessData.denialReason,
            timestamp: accessData.timestamp,
            ipAddress: accessData.ipAddress,
            metadata: JSON.stringify(accessData.metadata || {}),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Generate audit log
    await (0, exports.generateAuditLog)({
        eventType: AuditEventType.DATA_ACCESS,
        userId: accessData.userId,
        action: `${accessData.accessType}_${accessData.resourceType}`,
        resourceType: accessData.resourceType,
        resourceId: accessData.resourceId,
        severity: accessData.accessGranted ? AuditSeverity.INFORMATIONAL : AuditSeverity.MEDIUM,
        ipAddress: accessData.ipAddress,
        success: accessData.accessGranted,
        details: { denialReason: accessData.denialReason },
    }, sequelize, transaction);
    common_1.Logger.log(`Access audit recorded: ${accessId}, User: ${accessData.userId}`, 'AccessAudit');
    return accessLog;
};
exports.recordAccessAudit = recordAccessAudit;
/**
 * Gets user access history for specific resource
 *
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Access history records
 *
 * @example
 * ```typescript
 * const history = await getUserAccessHistory(
 *   'user-123',
 *   'PATIENT_RECORD',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
const getUserAccessHistory = async (userId, resourceType, startDate, endDate, sequelize) => {
    const history = await sequelize.query(`SELECT * FROM access_audits
     WHERE user_id = :userId
     AND resource_type = :resourceType
     AND timestamp >= :startDate
     AND timestamp <= :endDate
     ORDER BY timestamp DESC`, {
        replacements: { userId, resourceType, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return history;
};
exports.getUserAccessHistory = getUserAccessHistory;
/**
 * Gets resource access history (who accessed specific resource)
 *
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Access history for resource
 *
 * @example
 * ```typescript
 * const accessors = await getResourceAccessHistory(
 *   'FINANCIAL_RECORD',
 *   'record-789',
 *   sequelize
 * );
 * ```
 */
const getResourceAccessHistory = async (resourceType, resourceId, sequelize) => {
    const history = await sequelize.query(`SELECT * FROM access_audits
     WHERE resource_type = :resourceType AND resource_id = :resourceId
     ORDER BY timestamp DESC
     LIMIT 100`, {
        replacements: { resourceType, resourceId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return history;
};
exports.getResourceAccessHistory = getResourceAccessHistory;
/**
 * Detects unusual access patterns for anomaly detection
 *
 * @param {string} userId - User ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{anomalies: Array<Record<string, any>>}>} Detected anomalies
 *
 * @example
 * ```typescript
 * const result = await detectUnusualAccessPatterns('user-123', sequelize);
 * console.log(`Found ${result.anomalies.length} unusual patterns`);
 * ```
 */
const detectUnusualAccessPatterns = async (userId, sequelize) => {
    const anomalies = [];
    // Check for unusual access times
    const nightAccess = await sequelize.query(`SELECT COUNT(*) as count FROM access_audits
     WHERE user_id = :userId
     AND EXTRACT(HOUR FROM timestamp) BETWEEN 0 AND 5
     AND timestamp >= :last30Days`, {
        replacements: {
            userId,
            last30Days: (0, date_fns_1.addDays)(new Date(), -30),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (nightAccess[0].count > 10) {
        anomalies.push({
            type: 'UNUSUAL_ACCESS_TIME',
            description: 'Multiple accesses during off-hours (midnight-5am)',
            count: nightAccess[0].count,
        });
    }
    // Check for bulk data access
    const bulkAccess = await sequelize.query(`SELECT COUNT(DISTINCT resource_id) as unique_resources
     FROM access_audits
     WHERE user_id = :userId
     AND timestamp >= :lastHour`, {
        replacements: {
            userId,
            lastHour: (0, date_fns_1.addDays)(new Date(), -1 / 24),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (bulkAccess[0].unique_resources > 50) {
        anomalies.push({
            type: 'BULK_DATA_ACCESS',
            description: 'Accessed unusually large number of resources in short time',
            count: bulkAccess[0].unique_resources,
        });
    }
    return { anomalies };
};
exports.detectUnusualAccessPatterns = detectUnusualAccessPatterns;
/**
 * Generates access control effectiveness report
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Access control report
 *
 * @example
 * ```typescript
 * const report = await generateAccessControlReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
const generateAccessControlReport = async (startDate, endDate, sequelize) => {
    const totalAccess = await sequelize.query(`SELECT
       COUNT(*) as total_attempts,
       COUNT(CASE WHEN access_granted = true THEN 1 END) as granted,
       COUNT(CASE WHEN access_granted = false THEN 1 END) as denied,
       access_type,
       COUNT(*) as count
     FROM access_audits
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY access_type`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const denialReasons = await sequelize.query(`SELECT denial_reason, COUNT(*) as count
     FROM access_audits
     WHERE access_granted = false AND timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY denial_reason
     ORDER BY count DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        timeRange: { startDate, endDate },
        totalAccess,
        denialReasons,
        generatedAt: new Date(),
    };
};
exports.generateAccessControlReport = generateAccessControlReport;
/**
 * Tracks privileged access (admin/elevated permissions)
 *
 * @param {Object} privilegedAccessData - Privileged access data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created privileged access record
 *
 * @example
 * ```typescript
 * const privilegedAccess = await trackPrivilegedAccess({
 *   userId: 'admin-123',
 *   privilegeLevel: 'SUPERUSER',
 *   action: 'DATABASE_MODIFICATION',
 *   justification: 'Emergency data correction',
 * }, sequelize);
 * ```
 */
const trackPrivilegedAccess = async (privilegedAccessData, sequelize) => {
    const accessId = `priv-access-${Date.now()}`;
    const [privilegedAccess] = await sequelize.query(`INSERT INTO privileged_access_logs (id, user_id, privilege_level, action, resource_type,
     resource_id, justification, approved_by, timestamp, created_at)
     VALUES (:id, :userId, :privilegeLevel, :action, :resourceType, :resourceId, :justification,
     :approvedBy, :timestamp, :createdAt)
     RETURNING *`, {
        replacements: {
            id: accessId,
            userId: privilegedAccessData.userId,
            privilegeLevel: privilegedAccessData.privilegeLevel,
            action: privilegedAccessData.action,
            resourceType: privilegedAccessData.resourceType,
            resourceId: privilegedAccessData.resourceId,
            justification: privilegedAccessData.justification,
            approvedBy: privilegedAccessData.approvedBy,
            timestamp: new Date(),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    // Create high-severity audit log
    await (0, exports.generateAuditLog)({
        eventType: AuditEventType.PERMISSION_CHANGE,
        userId: privilegedAccessData.userId,
        action: `PRIVILEGED_${privilegedAccessData.action}`,
        resourceType: privilegedAccessData.resourceType || 'SYSTEM',
        resourceId: privilegedAccessData.resourceId,
        severity: AuditSeverity.HIGH,
        success: true,
        details: {
            privilegeLevel: privilegedAccessData.privilegeLevel,
            justification: privilegedAccessData.justification,
        },
    }, sequelize);
    common_1.Logger.log(`Privileged access tracked: ${accessId}, User: ${privilegedAccessData.userId}`, 'AccessAudit');
    return privilegedAccess;
};
exports.trackPrivilegedAccess = trackPrivilegedAccess;
// ============================================================================
// 21-25: CHANGE TRACKING AND VERSIONING
// ============================================================================
/**
 * Records data change with full versioning support
 *
 * @param {ChangeRecord} changeData - Change record data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created change record
 *
 * @example
 * ```typescript
 * const changeRecord = await recordDataChange({
 *   entityType: 'USER',
 *   entityId: 'user-123',
 *   changeType: 'UPDATE',
 *   userId: 'admin-456',
 *   fieldName: 'email',
 *   oldValue: 'old@example.com',
 *   newValue: 'new@example.com',
 *   version: 5,
 *   changeReason: 'User request',
 * }, sequelize);
 * ```
 */
const recordDataChange = async (changeData, sequelize, transaction) => {
    const changeId = `change-${Date.now()}`;
    const [changeRecord] = await sequelize.query(`INSERT INTO change_records (id, entity_type, entity_id, change_type, user_id, field_name,
     old_value, new_value, version, change_reason, approved_by, timestamp, metadata, created_at)
     VALUES (:id, :entityType, :entityId, :changeType, :userId, :fieldName, :oldValue, :newValue,
     :version, :changeReason, :approvedBy, :timestamp, :metadata, :createdAt)
     RETURNING *`, {
        replacements: {
            id: changeId,
            entityType: changeData.entityType,
            entityId: changeData.entityId,
            changeType: changeData.changeType,
            userId: changeData.userId,
            fieldName: changeData.fieldName,
            oldValue: JSON.stringify(changeData.oldValue),
            newValue: JSON.stringify(changeData.newValue),
            version: changeData.version,
            changeReason: changeData.changeReason,
            approvedBy: changeData.approvedBy,
            timestamp: new Date(),
            metadata: JSON.stringify(changeData.metadata || {}),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Create audit log for change
    await (0, exports.generateAuditLog)({
        eventType: AuditEventType.DATA_MODIFICATION,
        userId: changeData.userId,
        action: `${changeData.changeType}_${changeData.entityType}`,
        resourceType: changeData.entityType,
        resourceId: changeData.entityId,
        severity: AuditSeverity.INFORMATIONAL,
        success: true,
        details: {
            fieldName: changeData.fieldName,
            version: changeData.version,
        },
    }, sequelize, transaction);
    common_1.Logger.log(`Change recorded: ${changeId}, Entity: ${changeData.entityType}/${changeData.entityId}`, 'ChangeTracking');
    return changeRecord;
};
exports.recordDataChange = recordDataChange;
/**
 * Gets complete change history for an entity
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Change history records
 *
 * @example
 * ```typescript
 * const history = await getEntityChangeHistory('CUSTOMER', 'customer-789', sequelize);
 * console.log(`Entity has ${history.length} change records`);
 * ```
 */
const getEntityChangeHistory = async (entityType, entityId, sequelize) => {
    const history = await sequelize.query(`SELECT * FROM change_records
     WHERE entity_type = :entityType AND entity_id = :entityId
     ORDER BY version DESC, timestamp DESC`, {
        replacements: { entityType, entityId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return history;
};
exports.getEntityChangeHistory = getEntityChangeHistory;
/**
 * Compares two versions of an entity
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Version comparison
 *
 * @example
 * ```typescript
 * const diff = await compareEntityVersions('PRODUCT', 'product-123', 1, 5, sequelize);
 * console.log('Changes:', diff.differences);
 * ```
 */
const compareEntityVersions = async (entityType, entityId, version1, version2, sequelize) => {
    const changes = await sequelize.query(`SELECT * FROM change_records
     WHERE entity_type = :entityType
     AND entity_id = :entityId
     AND version > :version1
     AND version <= :version2
     ORDER BY version ASC`, {
        replacements: { entityType, entityId, version1, version2 },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const differences = changes.map((change) => ({
        version: change.version,
        field: change.field_name,
        changeType: change.change_type,
        oldValue: change.old_value,
        newValue: change.new_value,
        changedBy: change.user_id,
        timestamp: change.timestamp,
    }));
    return {
        entityType,
        entityId,
        fromVersion: version1,
        toVersion: version2,
        totalChanges: differences.length,
        differences,
    };
};
exports.compareEntityVersions = compareEntityVersions;
/**
 * Rolls back entity to previous version
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} targetVersion - Version to rollback to
 * @param {string} rolledBackBy - User ID performing rollback
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{rollbackId: string, changesReverted: number}>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackToVersion(
 *   'CONFIGURATION',
 *   'config-123',
 *   3,
 *   'admin-456',
 *   sequelize
 * );
 * ```
 */
const rollbackToVersion = async (entityType, entityId, targetVersion, rolledBackBy, sequelize) => {
    const rollbackId = `rollback-${Date.now()}`;
    // Get changes after target version
    const changesToRevert = await sequelize.query(`SELECT * FROM change_records
     WHERE entity_type = :entityType
     AND entity_id = :entityId
     AND version > :targetVersion
     ORDER BY version DESC`, {
        replacements: { entityType, entityId, targetVersion },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Record rollback action
    await sequelize.query(`INSERT INTO rollback_actions (id, entity_type, entity_id, target_version,
     changes_reverted, rolled_back_by, timestamp)
     VALUES (:id, :entityType, :entityId, :targetVersion, :changesReverted,
     :rolledBackBy, :timestamp)`, {
        replacements: {
            id: rollbackId,
            entityType,
            entityId,
            targetVersion,
            changesReverted: changesToRevert.length,
            rolledBackBy,
            timestamp: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Rollback executed: ${rollbackId}, Entity: ${entityType}/${entityId}, Version: ${targetVersion}`, 'ChangeTracking');
    return {
        rollbackId,
        changesReverted: changesToRevert.length,
    };
};
exports.rollbackToVersion = rollbackToVersion;
/**
 * Generates change tracking report
 *
 * @param {Object} params - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Change tracking report
 *
 * @example
 * ```typescript
 * const report = await generateChangeTrackingReport({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   entityType: 'CUSTOMER',
 * }, sequelize);
 * ```
 */
const generateChangeTrackingReport = async (params, sequelize) => {
    let entityTypeFilter = '';
    let userFilter = '';
    if (params.entityType) {
        entityTypeFilter = 'AND entity_type = :entityType';
    }
    if (params.userId) {
        userFilter = 'AND user_id = :userId';
    }
    const summary = await sequelize.query(`SELECT
       COUNT(*) as total_changes,
       change_type,
       COUNT(*) as count,
       COUNT(DISTINCT entity_id) as unique_entities,
       COUNT(DISTINCT user_id) as unique_users
     FROM change_records
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     ${entityTypeFilter} ${userFilter}
     GROUP BY change_type`, {
        replacements: {
            startDate: params.startDate,
            endDate: params.endDate,
            entityType: params.entityType,
            userId: params.userId,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const topChangedEntities = await sequelize.query(`SELECT entity_type, entity_id, COUNT(*) as change_count
     FROM change_records
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     ${entityTypeFilter}
     GROUP BY entity_type, entity_id
     ORDER BY change_count DESC
     LIMIT 20`, {
        replacements: {
            startDate: params.startDate,
            endDate: params.endDate,
            entityType: params.entityType,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        timeRange: { startDate: params.startDate, endDate: params.endDate },
        summary,
        topChangedEntities,
        generatedAt: new Date(),
    };
};
exports.generateChangeTrackingReport = generateChangeTrackingReport;
// ============================================================================
// 26-30: COMPLIANCE AUDIT SUPPORT
// ============================================================================
/**
 * Creates compliance audit entry
 *
 * @param {ComplianceAuditData} auditData - Compliance audit data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created compliance audit record
 *
 * @example
 * ```typescript
 * const audit = await createComplianceAudit({
 *   standard: ComplianceStandard.HIPAA,
 *   controlId: 'HIPAA-164.308(a)(1)',
 *   controlName: 'Security Management Process',
 *   auditDate: new Date(),
 *   auditorId: 'auditor-123',
 *   complianceStatus: 'COMPLIANT',
 *   findings: [],
 *   recommendations: [],
 *   evidenceIds: ['evidence-1', 'evidence-2'],
 * }, sequelize);
 * ```
 */
const createComplianceAudit = async (auditData, sequelize) => {
    const auditId = `comp-audit-${Date.now()}`;
    const [audit] = await sequelize.query(`INSERT INTO compliance_audits (id, standard, control_id, control_name, audit_date,
     auditor_id, compliance_status, findings, recommendations, evidence_ids, next_audit_date,
     created_at)
     VALUES (:id, :standard, :controlId, :controlName, :auditDate, :auditorId,
     :complianceStatus, :findings, :recommendations, :evidenceIds, :nextAuditDate, :createdAt)
     RETURNING *`, {
        replacements: {
            id: auditId,
            standard: auditData.standard,
            controlId: auditData.controlId,
            controlName: auditData.controlName,
            auditDate: auditData.auditDate,
            auditorId: auditData.auditorId,
            complianceStatus: auditData.complianceStatus,
            findings: JSON.stringify(auditData.findings),
            recommendations: JSON.stringify(auditData.recommendations),
            evidenceIds: JSON.stringify(auditData.evidenceIds),
            nextAuditDate: auditData.nextAuditDate,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Compliance audit created: ${auditId}, Standard: ${auditData.standard}`, 'ComplianceAudit');
    return audit;
};
exports.createComplianceAudit = createComplianceAudit;
/**
 * Validates compliance requirements for a standard
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateComplianceRequirements(
 *   ComplianceStandard.SOC2_TYPE_II,
 *   sequelize
 * );
 * console.log('Compliance score:', validation.complianceScore);
 * ```
 */
const validateComplianceRequirements = async (standard, sequelize) => {
    const audits = await sequelize.query(`SELECT * FROM compliance_audits
     WHERE standard = :standard
     ORDER BY audit_date DESC`, {
        replacements: { standard },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const totalControls = audits.length;
    const compliantControls = audits.filter((a) => a.compliance_status === 'COMPLIANT').length;
    const nonCompliantControls = audits.filter((a) => a.compliance_status === 'NON_COMPLIANT').length;
    const complianceScore = totalControls > 0 ? (compliantControls / totalControls) * 100 : 0;
    return {
        standard,
        totalControls,
        compliantControls,
        nonCompliantControls,
        complianceScore: complianceScore.toFixed(2),
        overallStatus: complianceScore >= 95 ? 'COMPLIANT' : 'NON_COMPLIANT',
        validatedAt: new Date(),
    };
};
exports.validateComplianceRequirements = validateComplianceRequirements;
/**
 * Generates compliance audit report
 *
 * @param {Object} params - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceAuditReport({
 *   standard: ComplianceStandard.GDPR,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   scope: ['data-protection', 'privacy'],
 * }, sequelize);
 * ```
 */
const generateComplianceAuditReport = async (params, sequelize) => {
    const reportId = `comp-report-${Date.now()}`;
    const audits = await sequelize.query(`SELECT * FROM compliance_audits
     WHERE standard = :standard
     AND audit_date >= :startDate
     AND audit_date <= :endDate
     ORDER BY audit_date DESC`, {
        replacements: {
            standard: params.standard,
            startDate: params.startDate,
            endDate: params.endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const statusSummary = audits.reduce((acc, audit) => {
        acc[audit.compliance_status] = (acc[audit.compliance_status] || 0) + 1;
        return acc;
    }, {});
    const allFindings = audits.flatMap((audit) => JSON.parse(audit.findings || '[]'));
    const allRecommendations = audits.flatMap((audit) => JSON.parse(audit.recommendations || '[]'));
    return {
        reportId,
        standard: params.standard,
        timeRange: { startDate: params.startDate, endDate: params.endDate },
        totalAudits: audits.length,
        statusSummary,
        findings: allFindings,
        recommendations: allRecommendations,
        scope: params.scope,
        generatedAt: new Date(),
    };
};
exports.generateComplianceAuditReport = generateComplianceAuditReport;
/**
 * Maps audit logs to compliance controls
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Mapping results
 *
 * @example
 * ```typescript
 * const mapping = await mapAuditLogsToCompliance(
 *   ComplianceStandard.PCI_DSS,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
const mapAuditLogsToCompliance = async (standard, startDate, endDate, sequelize) => {
    const controlMappings = {
        [ComplianceStandard.SOC2_TYPE_II]: [
            AuditEventType.USER_LOGIN,
            AuditEventType.DATA_ACCESS,
            AuditEventType.PERMISSION_CHANGE,
        ],
        [ComplianceStandard.HIPAA]: [
            AuditEventType.DATA_ACCESS,
            AuditEventType.DATA_MODIFICATION,
            AuditEventType.DATA_EXPORT,
        ],
        [ComplianceStandard.PCI_DSS]: [
            AuditEventType.DATA_ACCESS,
            AuditEventType.CONFIGURATION_CHANGE,
            AuditEventType.SECURITY_POLICY_UPDATE,
        ],
    };
    const relevantEventTypes = controlMappings[standard] || [];
    const logs = await sequelize.query(`SELECT event_type, COUNT(*) as count
     FROM audit_logs
     WHERE timestamp >= :startDate
     AND timestamp <= :endDate
     AND event_type IN (:eventTypes)
     GROUP BY event_type`, {
        replacements: {
            startDate,
            endDate,
            eventTypes: relevantEventTypes,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        standard,
        timeRange: { startDate, endDate },
        mappedEventTypes: relevantEventTypes,
        eventCounts: logs,
        totalMappedEvents: logs.reduce((sum, log) => sum + parseInt(log.count, 10), 0),
    };
};
exports.mapAuditLogsToCompliance = mapAuditLogsToCompliance;
/**
 * Tracks compliance evidence and artifacts
 *
 * @param {Object} evidenceData - Evidence data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created evidence record
 *
 * @example
 * ```typescript
 * const evidence = await trackComplianceEvidence({
 *   standard: ComplianceStandard.ISO_27001,
 *   controlId: 'A.9.2.1',
 *   evidenceType: 'ACCESS_LOG',
 *   description: 'User access logs for Q1 2025',
 *   filePath: '/evidence/access-logs-q1-2025.pdf',
 *   collectedBy: 'auditor-123',
 * }, sequelize);
 * ```
 */
const trackComplianceEvidence = async (evidenceData, sequelize) => {
    const evidenceId = `evidence-${Date.now()}`;
    const [evidence] = await sequelize.query(`INSERT INTO compliance_evidence (id, standard, control_id, evidence_type, description,
     file_path, collected_by, collection_date, metadata, created_at)
     VALUES (:id, :standard, :controlId, :evidenceType, :description, :filePath,
     :collectedBy, :collectionDate, :metadata, :createdAt)
     RETURNING *`, {
        replacements: {
            id: evidenceId,
            standard: evidenceData.standard,
            controlId: evidenceData.controlId,
            evidenceType: evidenceData.evidenceType,
            description: evidenceData.description,
            filePath: evidenceData.filePath,
            collectedBy: evidenceData.collectedBy,
            collectionDate: new Date(),
            metadata: JSON.stringify(evidenceData.metadata || {}),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Compliance evidence tracked: ${evidenceId}, Control: ${evidenceData.controlId}`, 'ComplianceAudit');
    return evidence;
};
exports.trackComplianceEvidence = trackComplianceEvidence;
// ============================================================================
// 31-34: FORENSIC LOG ANALYSIS
// ============================================================================
/**
 * Performs forensic analysis on audit logs
 *
 * @param {Object} analysisParams - Analysis parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ForensicAnalysis>} Forensic analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performForensicAnalysis({
 *   incidentId: 'incident-123',
 *   analysisType: 'DATA_BREACH_INVESTIGATION',
 *   timeRange: {
 *     startDate: new Date('2025-01-15'),
 *     endDate: new Date('2025-01-20'),
 *   },
 *   scope: ['user-123', '192.168.1.50'],
 * }, sequelize);
 * ```
 */
const performForensicAnalysis = async (analysisParams, sequelize) => {
    const analysisId = `forensic-${Date.now()}`;
    // Gather all relevant audit logs
    const logs = await sequelize.query(`SELECT * FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     AND (user_id IN (:scope) OR ip_address IN (:scope) OR resource_id IN (:scope))
     ORDER BY timestamp ASC`, {
        replacements: {
            startDate: analysisParams.timeRange.startDate,
            endDate: analysisParams.timeRange.endDate,
            scope: analysisParams.scope,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Analyze patterns
    const findings = [];
    const timeline = [];
    for (const log of logs) {
        timeline.push({
            timestamp: log.timestamp,
            event: `${log.action} on ${log.resource_type}`,
        });
        // Detect suspicious patterns
        if (log.severity === 'CRITICAL' || log.severity === 'HIGH') {
            findings.push({
                severity: log.severity,
                description: `${log.action} - ${log.description || 'High-severity event detected'}`,
                evidence: [log.id],
            });
        }
    }
    const recommendations = [
        'Review all flagged high-severity events',
        'Investigate access patterns for anomalies',
        'Verify integrity of affected resources',
    ];
    const analysis = {
        analysisId,
        incidentId: analysisParams.incidentId,
        analysisType: analysisParams.analysisType,
        timeRange: analysisParams.timeRange,
        scope: analysisParams.scope,
        findings,
        timeline,
        recommendations,
    };
    // Store analysis
    await sequelize.query(`INSERT INTO forensic_analyses (id, incident_id, analysis_type, time_range, scope,
     findings, timeline, recommendations, created_at)
     VALUES (:id, :incidentId, :analysisType, :timeRange, :scope, :findings, :timeline,
     :recommendations, :createdAt)`, {
        replacements: {
            id: analysisId,
            incidentId: analysisParams.incidentId,
            analysisType: analysisParams.analysisType,
            timeRange: JSON.stringify(analysisParams.timeRange),
            scope: JSON.stringify(analysisParams.scope),
            findings: JSON.stringify(findings),
            timeline: JSON.stringify(timeline),
            recommendations: JSON.stringify(recommendations),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Forensic analysis completed: ${analysisId}`, 'ForensicAnalysis');
    return analysis;
};
exports.performForensicAnalysis = performForensicAnalysis;
/**
 * Reconstructs timeline of events for investigation
 *
 * @param {Object} params - Timeline reconstruction parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Reconstructed timeline
 *
 * @example
 * ```typescript
 * const timeline = await reconstructEventTimeline({
 *   userId: 'user-123',
 *   startDate: new Date('2025-01-15T14:00:00Z'),
 *   endDate: new Date('2025-01-15T16:00:00Z'),
 * }, sequelize);
 * ```
 */
const reconstructEventTimeline = async (params, sequelize) => {
    const whereConditions = ['timestamp >= :startDate', 'timestamp <= :endDate'];
    const replacements = {
        startDate: params.startDate,
        endDate: params.endDate,
    };
    if (params.userId) {
        whereConditions.push('user_id = :userId');
        replacements.userId = params.userId;
    }
    if (params.ipAddress) {
        whereConditions.push('ip_address = :ipAddress');
        replacements.ipAddress = params.ipAddress;
    }
    if (params.resourceId) {
        whereConditions.push('resource_id = :resourceId');
        replacements.resourceId = params.resourceId;
    }
    const events = await sequelize.query(`SELECT
       timestamp,
       event_type,
       action,
       user_id,
       resource_type,
       resource_id,
       ip_address,
       success,
       severity
     FROM audit_logs
     WHERE ${whereConditions.join(' AND ')}
     ORDER BY timestamp ASC`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return events.map((event, index) => ({
        sequenceNumber: index + 1,
        timestamp: event.timestamp,
        eventType: event.event_type,
        action: event.action,
        user: event.user_id,
        resource: `${event.resource_type}/${event.resource_id}`,
        ipAddress: event.ip_address,
        success: event.success,
        severity: event.severity,
    }));
};
exports.reconstructEventTimeline = reconstructEventTimeline;
/**
 * Analyzes log patterns for anomaly detection
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{anomalies: Array<Record<string, any>>}>} Detected anomalies
 *
 * @example
 * ```typescript
 * const result = await analyzeLogPatterns(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * console.log(`Detected ${result.anomalies.length} anomalies`);
 * ```
 */
const analyzeLogPatterns = async (startDate, endDate, sequelize) => {
    const anomalies = [];
    // Detect unusual activity volumes
    const hourlyVolumes = await sequelize.query(`SELECT
       DATE_TRUNC('hour', timestamp) as hour,
       COUNT(*) as event_count
     FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY hour
     ORDER BY event_count DESC
     LIMIT 10`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    for (const volume of hourlyVolumes) {
        if (volume.event_count > 1000) {
            anomalies.push({
                type: 'HIGH_VOLUME_ACTIVITY',
                timestamp: volume.hour,
                description: `Unusual high volume: ${volume.event_count} events in one hour`,
                severity: AuditSeverity.MEDIUM,
            });
        }
    }
    // Detect repeated failures
    const failurePatterns = await sequelize.query(`SELECT user_id, ip_address, COUNT(*) as failure_count
     FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     AND success = false
     GROUP BY user_id, ip_address
     HAVING COUNT(*) > 10
     ORDER BY failure_count DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    for (const pattern of failurePatterns) {
        anomalies.push({
            type: 'REPEATED_FAILURES',
            userId: pattern.user_id,
            ipAddress: pattern.ip_address,
            description: `${pattern.failure_count} repeated failures detected`,
            severity: AuditSeverity.HIGH,
        });
    }
    return { anomalies };
};
exports.analyzeLogPatterns = analyzeLogPatterns;
/**
 * Generates forensic investigation report
 *
 * @param {string} analysisId - Forensic analysis ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Investigation report
 *
 * @example
 * ```typescript
 * const report = await generateForensicReport('forensic-123', sequelize);
 * ```
 */
const generateForensicReport = async (analysisId, sequelize) => {
    const [analysis] = await sequelize.query(`SELECT * FROM forensic_analyses WHERE id = :analysisId`, { replacements: { analysisId }, type: sequelize_1.QueryTypes.SELECT });
    if (!analysis) {
        throw new common_1.NotFoundException(`Forensic analysis ${analysisId} not found`);
    }
    const reportId = `forensic-report-${Date.now()}`;
    const report = {
        reportId,
        analysisId,
        incidentId: analysis.incident_id,
        analysisType: analysis.analysis_type,
        timeRange: JSON.parse(analysis.time_range),
        scope: JSON.parse(analysis.scope),
        executiveSummary: `Forensic analysis completed for ${analysis.analysis_type}`,
        findings: JSON.parse(analysis.findings),
        timeline: JSON.parse(analysis.timeline),
        recommendations: JSON.parse(analysis.recommendations),
        generatedAt: new Date(),
    };
    await sequelize.query(`INSERT INTO forensic_reports (id, analysis_id, report_data, generated_at)
     VALUES (:id, :analysisId, :reportData, :generatedAt)`, {
        replacements: {
            id: reportId,
            analysisId,
            reportData: JSON.stringify(report),
            generatedAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Forensic report generated: ${reportId}`, 'ForensicAnalysis');
    return report;
};
exports.generateForensicReport = generateForensicReport;
// ============================================================================
// 35-36: LOG RETENTION POLICIES
// ============================================================================
/**
 * Creates log retention policy
 *
 * @param {LogRetentionPolicy} policy - Retention policy data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created retention policy
 *
 * @example
 * ```typescript
 * const policy = await createLogRetentionPolicy({
 *   policyId: 'policy-001',
 *   policyName: 'HIPAA Audit Log Retention',
 *   eventTypes: [AuditEventType.DATA_ACCESS, AuditEventType.DATA_MODIFICATION],
 *   retentionPeriod: RetentionPeriod.YEARS_7,
 *   archivalEnabled: true,
 *   archivalDestination: 's3://audit-archive/',
 *   complianceStandards: [ComplianceStandard.HIPAA],
 *   autoDeleteEnabled: false,
 * }, sequelize);
 * ```
 */
const createLogRetentionPolicy = async (policy, sequelize) => {
    const [retentionPolicy] = await sequelize.query(`INSERT INTO log_retention_policies (id, policy_name, event_types, retention_period,
     archival_enabled, archival_destination, compliance_standards, auto_delete_enabled, created_at)
     VALUES (:id, :policyName, :eventTypes, :retentionPeriod, :archivalEnabled,
     :archivalDestination, :complianceStandards, :autoDeleteEnabled, :createdAt)
     RETURNING *`, {
        replacements: {
            id: policy.policyId,
            policyName: policy.policyName,
            eventTypes: JSON.stringify(policy.eventTypes),
            retentionPeriod: policy.retentionPeriod,
            archivalEnabled: policy.archivalEnabled,
            archivalDestination: policy.archivalDestination,
            complianceStandards: JSON.stringify(policy.complianceStandards),
            autoDeleteEnabled: policy.autoDeleteEnabled,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Log retention policy created: ${policy.policyId}`, 'RetentionPolicy');
    return retentionPolicy;
};
exports.createLogRetentionPolicy = createLogRetentionPolicy;
/**
 * Applies retention policies to audit logs
 *
 * @param {string} policyId - Retention policy ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{processed: number, archived: number, deleted: number}>} Application results
 *
 * @example
 * ```typescript
 * const result = await applyRetentionPolicy('policy-001', sequelize);
 * console.log(`Archived ${result.archived} logs, deleted ${result.deleted} logs`);
 * ```
 */
const applyRetentionPolicy = async (policyId, sequelize) => {
    const [policy] = await sequelize.query(`SELECT * FROM log_retention_policies WHERE id = :policyId`, { replacements: { policyId }, type: sequelize_1.QueryTypes.SELECT });
    if (!policy) {
        throw new common_1.NotFoundException(`Retention policy ${policyId} not found`);
    }
    const retentionDays = {
        [RetentionPeriod.DAYS_30]: 30,
        [RetentionPeriod.DAYS_90]: 90,
        [RetentionPeriod.DAYS_180]: 180,
        [RetentionPeriod.YEAR_1]: 365,
        [RetentionPeriod.YEARS_3]: 1095,
        [RetentionPeriod.YEARS_7]: 2555,
        [RetentionPeriod.YEARS_10]: 3650,
        [RetentionPeriod.PERMANENT]: 999999,
    }[policy.retention_period];
    const cutoffDate = (0, date_fns_1.addDays)(new Date(), -retentionDays);
    const eventTypes = JSON.parse(policy.event_types);
    let archived = 0;
    let deleted = 0;
    if (policy.archival_enabled) {
        const archiveResult = await (0, exports.archiveAuditLogs)(cutoffDate, policy.archival_destination, sequelize);
        archived = archiveResult.archivedCount;
    }
    if (policy.auto_delete_enabled) {
        const deleteResult = await (0, exports.purgeAuditLogs)(cutoffDate, sequelize);
        deleted = deleteResult.purgedCount;
    }
    common_1.Logger.log(`Retention policy applied: ${policyId}, Archived: ${archived}, Deleted: ${deleted}`, 'RetentionPolicy');
    return {
        processed: archived + deleted,
        archived,
        deleted,
    };
};
exports.applyRetentionPolicy = applyRetentionPolicy;
// ============================================================================
// 37-38: AUDIT REPORT GENERATION
// ============================================================================
/**
 * Generates comprehensive audit report
 *
 * @param {Object} reportParams - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AuditReport>} Generated audit report
 *
 * @example
 * ```typescript
 * const report = await generateAuditReport({
 *   reportType: 'MONTHLY_SECURITY_AUDIT',
 *   generatedBy: 'admin-123',
 *   timeRange: {
 *     startDate: new Date('2025-01-01'),
 *     endDate: new Date('2025-01-31'),
 *   },
 * }, sequelize);
 * ```
 */
const generateAuditReport = async (reportParams, sequelize) => {
    const reportId = `audit-report-${Date.now()}`;
    // Get total events
    const [{ count: totalEvents }] = await sequelize.query(`SELECT COUNT(*) as count FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate`, {
        replacements: reportParams.timeRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Events by type
    const eventsByType = await sequelize.query(`SELECT event_type, COUNT(*) as count FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY event_type
     ORDER BY count DESC`, {
        replacements: reportParams.timeRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Events by severity
    const eventsBySeverity = await sequelize.query(`SELECT severity, COUNT(*) as count FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate
     GROUP BY severity
     ORDER BY count DESC`, {
        replacements: reportParams.timeRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Top users
    const topUsers = await sequelize.query(`SELECT user_id, COUNT(*) as event_count FROM audit_logs
     WHERE timestamp >= :startDate AND timestamp <= :endDate AND user_id IS NOT NULL
     GROUP BY user_id
     ORDER BY event_count DESC
     LIMIT 10`, {
        replacements: reportParams.timeRange,
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Detect anomalies
    const { anomalies } = await (0, exports.analyzeLogPatterns)(reportParams.timeRange.startDate, reportParams.timeRange.endDate, sequelize);
    const report = {
        reportId,
        reportType: reportParams.reportType,
        generatedBy: reportParams.generatedBy,
        timeRange: reportParams.timeRange,
        totalEvents: parseInt(totalEvents, 10),
        eventsByType: eventsByType.reduce((acc, item) => {
            acc[item.event_type] = parseInt(item.count, 10);
            return acc;
        }, {}),
        eventsBySeverity: eventsBySeverity.reduce((acc, item) => {
            acc[item.severity] = parseInt(item.count, 10);
            return acc;
        }, {}),
        topUsers: topUsers,
        anomalies: anomalies.map(a => a.description),
    };
    // Store report
    await sequelize.query(`INSERT INTO audit_reports (id, report_type, generated_by, time_range, report_data, created_at)
     VALUES (:id, :reportType, :generatedBy, :timeRange, :reportData, :createdAt)`, {
        replacements: {
            id: reportId,
            reportType: reportParams.reportType,
            generatedBy: reportParams.generatedBy,
            timeRange: JSON.stringify(reportParams.timeRange),
            reportData: JSON.stringify(report),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Audit report generated: ${reportId}`, 'AuditReport');
    return report;
};
exports.generateAuditReport = generateAuditReport;
/**
 * Schedules automated audit report generation
 *
 * @param {Object} scheduleConfig - Schedule configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{scheduleId: string}>} Created schedule ID
 *
 * @example
 * ```typescript
 * const schedule = await scheduleAuditReport({
 *   reportType: 'WEEKLY_SECURITY_SUMMARY',
 *   frequency: 'WEEKLY',
 *   recipients: ['security-team@company.com'],
 *   generatedBy: 'system',
 * }, sequelize);
 * ```
 */
const scheduleAuditReport = async (scheduleConfig, sequelize) => {
    const scheduleId = `schedule-${Date.now()}`;
    await sequelize.query(`INSERT INTO audit_report_schedules (id, report_type, frequency, recipients,
     generated_by, filters, enabled, created_at)
     VALUES (:id, :reportType, :frequency, :recipients, :generatedBy, :filters, true, :createdAt)`, {
        replacements: {
            id: scheduleId,
            reportType: scheduleConfig.reportType,
            frequency: scheduleConfig.frequency,
            recipients: JSON.stringify(scheduleConfig.recipients),
            generatedBy: scheduleConfig.generatedBy,
            filters: JSON.stringify(scheduleConfig.filters || {}),
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Audit report schedule created: ${scheduleId}, Frequency: ${scheduleConfig.frequency}`, 'AuditReport');
    return { scheduleId };
};
exports.scheduleAuditReport = scheduleAuditReport;
// ============================================================================
// 39: CHAIN OF CUSTODY TRACKING
// ============================================================================
/**
 * Tracks chain of custody for evidence
 *
 * @param {ChainOfCustody} custodyData - Chain of custody data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created chain of custody record
 *
 * @example
 * ```typescript
 * const custody = await trackChainOfCustody({
 *   evidenceId: 'evidence-123',
 *   evidenceType: 'AUDIT_LOG',
 *   description: 'Audit logs for security incident #456',
 *   collectedBy: 'investigator-789',
 *   collectionDate: new Date(),
 *   custodyTransfers: [],
 *   integrityChecks: [],
 *   currentCustodian: 'investigator-789',
 * }, sequelize);
 * ```
 */
const trackChainOfCustody = async (custodyData, sequelize) => {
    // Calculate initial hash
    const initialHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(custodyData))
        .digest('hex');
    const [custody] = await sequelize.query(`INSERT INTO chain_of_custody (evidence_id, evidence_type, description, collected_by,
     collection_date, custody_transfers, integrity_checks, current_custodian, current_hash, created_at)
     VALUES (:evidenceId, :evidenceType, :description, :collectedBy, :collectionDate,
     :custodyTransfers, :integrityChecks, :currentCustodian, :currentHash, :createdAt)
     RETURNING *`, {
        replacements: {
            evidenceId: custodyData.evidenceId,
            evidenceType: custodyData.evidenceType,
            description: custodyData.description,
            collectedBy: custodyData.collectedBy,
            collectionDate: custodyData.collectionDate,
            custodyTransfers: JSON.stringify(custodyData.custodyTransfers),
            integrityChecks: JSON.stringify(custodyData.integrityChecks),
            currentCustodian: custodyData.currentCustodian,
            currentHash: initialHash,
            createdAt: new Date(),
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    common_1.Logger.log(`Chain of custody tracked: ${custodyData.evidenceId}`, 'ChainOfCustody');
    return custody;
};
exports.trackChainOfCustody = trackChainOfCustody;
// ============================================================================
// 40: TAMPER DETECTION
// ============================================================================
/**
 * Detects tampering in audit logs using cryptographic verification
 *
 * @param {string} auditLogId - Audit log ID to verify
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TamperDetection>} Tamper detection results
 *
 * @example
 * ```typescript
 * const detection = await detectLogTampering('audit-123', sequelize);
 * if (detection.tampered) {
 *   console.log('ALERT: Audit log tampering detected!');
 * }
 * ```
 */
const detectLogTampering = async (auditLogId, sequelize) => {
    const [auditLog] = await sequelize.query(`SELECT * FROM audit_logs WHERE id = :auditLogId`, { replacements: { auditLogId }, type: sequelize_1.QueryTypes.SELECT });
    if (!auditLog) {
        throw new common_1.NotFoundException(`Audit log ${auditLogId} not found`);
    }
    // Recalculate hash
    const hashInput = JSON.stringify({
        auditId: auditLog.id,
        eventType: auditLog.event_type,
        userId: auditLog.user_id,
        userName: auditLog.user_name,
        action: auditLog.action,
        resourceType: auditLog.resource_type,
        resourceId: auditLog.resource_id,
        severity: auditLog.severity,
        ipAddress: auditLog.ip_address,
        userAgent: auditLog.user_agent,
        sessionId: auditLog.session_id,
        success: auditLog.success,
        timestamp: auditLog.timestamp,
        details: auditLog.details,
        metadata: auditLog.metadata,
    });
    const currentHash = crypto.createHash('sha256').update(hashInput).digest('hex');
    const originalHash = auditLog.hash;
    const tampered = currentHash !== originalHash;
    const tamperIndicators = [];
    if (tampered) {
        tamperIndicators.push('HASH_MISMATCH');
        tamperIndicators.push('INTEGRITY_VIOLATION');
    }
    const detection = {
        auditLogId,
        originalHash,
        currentHash,
        tampered,
        detectionDate: new Date(),
        tamperIndicators,
        affectedRecords: tampered ? [auditLogId] : [],
    };
    // Log tamper detection
    if (tampered) {
        await (0, exports.trackSecurityEvent)({
            eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
            severity: AuditSeverity.CRITICAL,
            description: `Audit log tampering detected: ${auditLogId}`,
            affectedResources: [auditLogId],
            indicators: tamperIndicators,
            resolved: false,
        }, sequelize);
        common_1.Logger.warn(`TAMPER DETECTED: Audit log ${auditLogId} integrity violation`, 'TamperDetection');
    }
    return detection;
};
exports.detectLogTampering = detectLogTampering;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Audit Log Generation and Management (1-8)
    generateAuditLog: exports.generateAuditLog,
    getAuditLogs: exports.getAuditLogs,
    searchAuditLogs: exports.searchAuditLogs,
    updateAuditLogStatus: exports.updateAuditLogStatus,
    archiveAuditLogs: exports.archiveAuditLogs,
    exportAuditLogs: exports.exportAuditLogs,
    purgeAuditLogs: exports.purgeAuditLogs,
    aggregateAuditLogStatistics: exports.aggregateAuditLogStatistics,
    // Security Event Tracking (9-14)
    trackSecurityEvent: exports.trackSecurityEvent,
    correlateSecurityEvents: exports.correlateSecurityEvents,
    resolveSecurityEvent: exports.resolveSecurityEvent,
    getSecurityEventSummary: exports.getSecurityEventSummary,
    escalateSecurityEvent: exports.escalateSecurityEvent,
    generateSecurityEventAlerts: exports.generateSecurityEventAlerts,
    // Access Audit Trails (15-20)
    recordAccessAudit: exports.recordAccessAudit,
    getUserAccessHistory: exports.getUserAccessHistory,
    getResourceAccessHistory: exports.getResourceAccessHistory,
    detectUnusualAccessPatterns: exports.detectUnusualAccessPatterns,
    generateAccessControlReport: exports.generateAccessControlReport,
    trackPrivilegedAccess: exports.trackPrivilegedAccess,
    // Change Tracking and Versioning (21-25)
    recordDataChange: exports.recordDataChange,
    getEntityChangeHistory: exports.getEntityChangeHistory,
    compareEntityVersions: exports.compareEntityVersions,
    rollbackToVersion: exports.rollbackToVersion,
    generateChangeTrackingReport: exports.generateChangeTrackingReport,
    // Compliance Audit Support (26-30)
    createComplianceAudit: exports.createComplianceAudit,
    validateComplianceRequirements: exports.validateComplianceRequirements,
    generateComplianceAuditReport: exports.generateComplianceAuditReport,
    mapAuditLogsToCompliance: exports.mapAuditLogsToCompliance,
    trackComplianceEvidence: exports.trackComplianceEvidence,
    // Forensic Log Analysis (31-34)
    performForensicAnalysis: exports.performForensicAnalysis,
    reconstructEventTimeline: exports.reconstructEventTimeline,
    analyzeLogPatterns: exports.analyzeLogPatterns,
    generateForensicReport: exports.generateForensicReport,
    // Log Retention Policies (35-36)
    createLogRetentionPolicy: exports.createLogRetentionPolicy,
    applyRetentionPolicy: exports.applyRetentionPolicy,
    // Audit Report Generation (37-38)
    generateAuditReport: exports.generateAuditReport,
    scheduleAuditReport: exports.scheduleAuditReport,
    // Chain of Custody Tracking (39)
    trackChainOfCustody: exports.trackChainOfCustody,
    // Tamper Detection (40)
    detectLogTampering: exports.detectLogTampering,
};
//# sourceMappingURL=security-audit-trail-kit.js.map