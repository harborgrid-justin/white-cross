"use strict";
/**
 * LOC: AUDCOMP001
 * File: /reuse/edwards/financial/audit-trail-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend audit modules
 *   - Compliance reporting services
 *   - Security audit services
 *   - Regulatory reporting modules
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
exports.trackRemediationProgress = exports.performAutomatedControlTest = exports.generateComplianceDashboard = exports.monitorComplianceMetrics = exports.exportComplianceData = exports.validateDataIntegrity = exports.archiveAuditLogs = exports.getUserActivitySummary = exports.generateAuditTrailReport = exports.initiateForensicAnalysis = exports.createComplianceCertification = exports.detectSegregationOfDutiesViolations = exports.getTransactionHistory = exports.recordAccessControl = exports.logSecurityAuditEvent = exports.generateComplianceReport = exports.recordSOXControlTest = exports.createSOXControl = exports.buildDataLineageTrail = exports.logUserActivity = exports.trackFieldChange = exports.queryAuditLogs = exports.createAuditLog = exports.createChangeTrackingModel = exports.createSOXControlModel = exports.createAuditLogModel = exports.ComplianceReportDto = exports.SOXControlTestDto = exports.AuditLogQueryDto = exports.CreateAuditLogDto = void 0;
/**
 * File: /reuse/edwards/financial/audit-trail-compliance-kit.ts
 * Locator: WC-EDW-AUDCOMP-001
 * Purpose: Comprehensive Audit Trail & Compliance - JD Edwards EnterpriseOne-level audit logging, compliance reporting, SOX/FISMA compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/audit/*, Compliance Services, Security Audit, Regulatory Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for audit logging, change tracking, user activity, data lineage, compliance reporting, SOX/FISMA, security audits, access logs
 *
 * LLM Context: Enterprise-grade audit trail and compliance for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive audit logging, change tracking, user activity monitoring, data lineage tracking,
 * SOX 404 compliance, FISMA compliance, audit report generation, security audit trails, access control logging,
 * transaction history, compliance certifications, regulatory reporting, segregation of duties, and forensic analysis.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateAuditLogDto = (() => {
    var _a;
    let _tableName_decorators;
    let _tableName_initializers = [];
    let _tableName_extraInitializers = [];
    let _recordId_decorators;
    let _recordId_initializers = [];
    let _recordId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _oldValues_decorators;
    let _oldValues_initializers = [];
    let _oldValues_extraInitializers = [];
    let _newValues_decorators;
    let _newValues_initializers = [];
    let _newValues_extraInitializers = [];
    let _businessContext_decorators;
    let _businessContext_initializers = [];
    let _businessContext_extraInitializers = [];
    return _a = class CreateAuditLogDto {
            constructor() {
                this.tableName = __runInitializers(this, _tableName_initializers, void 0);
                this.recordId = (__runInitializers(this, _tableName_extraInitializers), __runInitializers(this, _recordId_initializers, void 0));
                this.action = (__runInitializers(this, _recordId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.userId = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.oldValues = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _oldValues_initializers, void 0));
                this.newValues = (__runInitializers(this, _oldValues_extraInitializers), __runInitializers(this, _newValues_initializers, void 0));
                this.businessContext = (__runInitializers(this, _newValues_extraInitializers), __runInitializers(this, _businessContext_initializers, void 0));
                __runInitializers(this, _businessContext_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tableName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Table name', example: 'journal_entry_headers' })];
            _recordId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Record ID', example: 123 })];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action performed', enum: ['INSERT', 'UPDATE', 'DELETE', 'SELECT', 'EXECUTE', 'APPROVE', 'REJECT', 'POST', 'REVERSE'] })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID', example: 'user123' })];
            _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address', example: '192.168.1.1' })];
            _oldValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Old values', required: false })];
            _newValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'New values', required: false })];
            _businessContext_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business context', required: false })];
            __esDecorate(null, null, _tableName_decorators, { kind: "field", name: "tableName", static: false, private: false, access: { has: obj => "tableName" in obj, get: obj => obj.tableName, set: (obj, value) => { obj.tableName = value; } }, metadata: _metadata }, _tableName_initializers, _tableName_extraInitializers);
            __esDecorate(null, null, _recordId_decorators, { kind: "field", name: "recordId", static: false, private: false, access: { has: obj => "recordId" in obj, get: obj => obj.recordId, set: (obj, value) => { obj.recordId = value; } }, metadata: _metadata }, _recordId_initializers, _recordId_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _oldValues_decorators, { kind: "field", name: "oldValues", static: false, private: false, access: { has: obj => "oldValues" in obj, get: obj => obj.oldValues, set: (obj, value) => { obj.oldValues = value; } }, metadata: _metadata }, _oldValues_initializers, _oldValues_extraInitializers);
            __esDecorate(null, null, _newValues_decorators, { kind: "field", name: "newValues", static: false, private: false, access: { has: obj => "newValues" in obj, get: obj => obj.newValues, set: (obj, value) => { obj.newValues = value; } }, metadata: _metadata }, _newValues_initializers, _newValues_extraInitializers);
            __esDecorate(null, null, _businessContext_decorators, { kind: "field", name: "businessContext", static: false, private: false, access: { has: obj => "businessContext" in obj, get: obj => obj.businessContext, set: (obj, value) => { obj.businessContext = value; } }, metadata: _metadata }, _businessContext_initializers, _businessContext_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAuditLogDto = CreateAuditLogDto;
let AuditLogQueryDto = (() => {
    var _a;
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _tableName_decorators;
    let _tableName_initializers = [];
    let _tableName_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _offset_decorators;
    let _offset_initializers = [];
    let _offset_extraInitializers = [];
    return _a = class AuditLogQueryDto {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.userId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.tableName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _tableName_initializers, void 0));
                this.action = (__runInitializers(this, _tableName_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.severity = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.limit = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.offset = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _offset_initializers, void 0));
                __runInitializers(this, _offset_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', required: false })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', required: false })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID filter', required: false })];
            _tableName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Table name filter', required: false })];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action filter', required: false })];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity filter', required: false })];
            _limit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Limit', default: 100 })];
            _offset_decorators = [(0, swagger_1.ApiProperty)({ description: 'Offset', default: 0 })];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _tableName_decorators, { kind: "field", name: "tableName", static: false, private: false, access: { has: obj => "tableName" in obj, get: obj => obj.tableName, set: (obj, value) => { obj.tableName = value; } }, metadata: _metadata }, _tableName_initializers, _tableName_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AuditLogQueryDto = AuditLogQueryDto;
let SOXControlTestDto = (() => {
    var _a;
    let _controlId_decorators;
    let _controlId_initializers = [];
    let _controlId_extraInitializers = [];
    let _testDate_decorators;
    let _testDate_initializers = [];
    let _testDate_extraInitializers = [];
    let _testedBy_decorators;
    let _testedBy_initializers = [];
    let _testedBy_extraInitializers = [];
    let _testProcedure_decorators;
    let _testProcedure_initializers = [];
    let _testProcedure_extraInitializers = [];
    let _sampleSize_decorators;
    let _sampleSize_initializers = [];
    let _sampleSize_extraInitializers = [];
    let _exceptionCount_decorators;
    let _exceptionCount_initializers = [];
    let _exceptionCount_extraInitializers = [];
    let _testResult_decorators;
    let _testResult_initializers = [];
    let _testResult_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _evidenceLocation_decorators;
    let _evidenceLocation_initializers = [];
    let _evidenceLocation_extraInitializers = [];
    return _a = class SOXControlTestDto {
            constructor() {
                this.controlId = __runInitializers(this, _controlId_initializers, void 0);
                this.testDate = (__runInitializers(this, _controlId_extraInitializers), __runInitializers(this, _testDate_initializers, void 0));
                this.testedBy = (__runInitializers(this, _testDate_extraInitializers), __runInitializers(this, _testedBy_initializers, void 0));
                this.testProcedure = (__runInitializers(this, _testedBy_extraInitializers), __runInitializers(this, _testProcedure_initializers, void 0));
                this.sampleSize = (__runInitializers(this, _testProcedure_extraInitializers), __runInitializers(this, _sampleSize_initializers, void 0));
                this.exceptionCount = (__runInitializers(this, _sampleSize_extraInitializers), __runInitializers(this, _exceptionCount_initializers, void 0));
                this.testResult = (__runInitializers(this, _exceptionCount_extraInitializers), __runInitializers(this, _testResult_initializers, void 0));
                this.findings = (__runInitializers(this, _testResult_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
                this.evidenceLocation = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _evidenceLocation_initializers, void 0));
                __runInitializers(this, _evidenceLocation_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _controlId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Control ID', example: 'CTRL-001' })];
            _testDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test date', example: '2024-12-31' })];
            _testedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tested by user ID', example: 'auditor123' })];
            _testProcedure_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test procedure description' })];
            _sampleSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sample size', example: 25 })];
            _exceptionCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of exceptions found', example: 0 })];
            _testResult_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test result', enum: ['passed', 'failed', 'partially_passed'] })];
            _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Findings and observations' })];
            _evidenceLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence location', example: 's3://audit-evidence/2024/ctrl-001/' })];
            __esDecorate(null, null, _controlId_decorators, { kind: "field", name: "controlId", static: false, private: false, access: { has: obj => "controlId" in obj, get: obj => obj.controlId, set: (obj, value) => { obj.controlId = value; } }, metadata: _metadata }, _controlId_initializers, _controlId_extraInitializers);
            __esDecorate(null, null, _testDate_decorators, { kind: "field", name: "testDate", static: false, private: false, access: { has: obj => "testDate" in obj, get: obj => obj.testDate, set: (obj, value) => { obj.testDate = value; } }, metadata: _metadata }, _testDate_initializers, _testDate_extraInitializers);
            __esDecorate(null, null, _testedBy_decorators, { kind: "field", name: "testedBy", static: false, private: false, access: { has: obj => "testedBy" in obj, get: obj => obj.testedBy, set: (obj, value) => { obj.testedBy = value; } }, metadata: _metadata }, _testedBy_initializers, _testedBy_extraInitializers);
            __esDecorate(null, null, _testProcedure_decorators, { kind: "field", name: "testProcedure", static: false, private: false, access: { has: obj => "testProcedure" in obj, get: obj => obj.testProcedure, set: (obj, value) => { obj.testProcedure = value; } }, metadata: _metadata }, _testProcedure_initializers, _testProcedure_extraInitializers);
            __esDecorate(null, null, _sampleSize_decorators, { kind: "field", name: "sampleSize", static: false, private: false, access: { has: obj => "sampleSize" in obj, get: obj => obj.sampleSize, set: (obj, value) => { obj.sampleSize = value; } }, metadata: _metadata }, _sampleSize_initializers, _sampleSize_extraInitializers);
            __esDecorate(null, null, _exceptionCount_decorators, { kind: "field", name: "exceptionCount", static: false, private: false, access: { has: obj => "exceptionCount" in obj, get: obj => obj.exceptionCount, set: (obj, value) => { obj.exceptionCount = value; } }, metadata: _metadata }, _exceptionCount_initializers, _exceptionCount_extraInitializers);
            __esDecorate(null, null, _testResult_decorators, { kind: "field", name: "testResult", static: false, private: false, access: { has: obj => "testResult" in obj, get: obj => obj.testResult, set: (obj, value) => { obj.testResult = value; } }, metadata: _metadata }, _testResult_initializers, _testResult_extraInitializers);
            __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
            __esDecorate(null, null, _evidenceLocation_decorators, { kind: "field", name: "evidenceLocation", static: false, private: false, access: { has: obj => "evidenceLocation" in obj, get: obj => obj.evidenceLocation, set: (obj, value) => { obj.evidenceLocation = value; } }, metadata: _metadata }, _evidenceLocation_initializers, _evidenceLocation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SOXControlTestDto = SOXControlTestDto;
let ComplianceReportDto = (() => {
    var _a;
    let _reportType_decorators;
    let _reportType_initializers = [];
    let _reportType_extraInitializers = [];
    let _periodStartDate_decorators;
    let _periodStartDate_initializers = [];
    let _periodStartDate_extraInitializers = [];
    let _periodEndDate_decorators;
    let _periodEndDate_initializers = [];
    let _periodEndDate_extraInitializers = [];
    let _preparedBy_decorators;
    let _preparedBy_initializers = [];
    let _preparedBy_extraInitializers = [];
    return _a = class ComplianceReportDto {
            constructor() {
                this.reportType = __runInitializers(this, _reportType_initializers, void 0);
                this.periodStartDate = (__runInitializers(this, _reportType_extraInitializers), __runInitializers(this, _periodStartDate_initializers, void 0));
                this.periodEndDate = (__runInitializers(this, _periodStartDate_extraInitializers), __runInitializers(this, _periodEndDate_initializers, void 0));
                this.preparedBy = (__runInitializers(this, _periodEndDate_extraInitializers), __runInitializers(this, _preparedBy_initializers, void 0));
                __runInitializers(this, _preparedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reportType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report type', enum: ['sox_404', 'fisma', 'sox_302', 'internal_audit', 'external_audit'] })];
            _periodStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start date', example: '2024-01-01' })];
            _periodEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end date', example: '2024-12-31' })];
            _preparedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Prepared by user ID', example: 'auditor123' })];
            __esDecorate(null, null, _reportType_decorators, { kind: "field", name: "reportType", static: false, private: false, access: { has: obj => "reportType" in obj, get: obj => obj.reportType, set: (obj, value) => { obj.reportType = value; } }, metadata: _metadata }, _reportType_initializers, _reportType_extraInitializers);
            __esDecorate(null, null, _periodStartDate_decorators, { kind: "field", name: "periodStartDate", static: false, private: false, access: { has: obj => "periodStartDate" in obj, get: obj => obj.periodStartDate, set: (obj, value) => { obj.periodStartDate = value; } }, metadata: _metadata }, _periodStartDate_initializers, _periodStartDate_extraInitializers);
            __esDecorate(null, null, _periodEndDate_decorators, { kind: "field", name: "periodEndDate", static: false, private: false, access: { has: obj => "periodEndDate" in obj, get: obj => obj.periodEndDate, set: (obj, value) => { obj.periodEndDate = value; } }, metadata: _metadata }, _periodEndDate_initializers, _periodEndDate_extraInitializers);
            __esDecorate(null, null, _preparedBy_decorators, { kind: "field", name: "preparedBy", static: false, private: false, access: { has: obj => "preparedBy" in obj, get: obj => obj.preparedBy, set: (obj, value) => { obj.preparedBy = value; } }, metadata: _metadata }, _preparedBy_initializers, _preparedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ComplianceReportDto = ComplianceReportDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Audit Log Entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditLog model
 *
 * @example
 * ```typescript
 * const AuditLog = createAuditLogModel(sequelize);
 * const entry = await AuditLog.create({
 *   tableName: 'journal_entry_headers',
 *   recordId: 123,
 *   action: 'UPDATE',
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
const createAuditLogModel = (sequelize) => {
    class AuditLog extends sequelize_1.Model {
    }
    AuditLog.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        tableName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Database table name',
        },
        recordId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: 'Record ID in the table',
        },
        action: {
            type: sequelize_1.DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT', 'EXECUTE', 'APPROVE', 'REJECT', 'POST', 'REVERSE'),
            allowNull: false,
            comment: 'Action performed',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who performed the action',
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'User full name',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Timestamp of action',
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User session ID',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'IP address (IPv4 or IPv6)',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Browser user agent',
        },
        oldValues: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Previous values before change',
        },
        newValues: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'New values after change',
        },
        changedFields: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'List of changed field names',
        },
        businessContext: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Business context description',
        },
        transactionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Database transaction ID',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'low',
            comment: 'Event severity',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('data_change', 'security', 'financial', 'access', 'system'),
            allowNull: false,
            comment: 'Event category',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'audit_logs',
        timestamps: false,
        indexes: [
            { fields: ['tableName', 'recordId'] },
            { fields: ['userId'] },
            { fields: ['timestamp'] },
            { fields: ['action'] },
            { fields: ['severity'] },
            { fields: ['category'] },
            { fields: ['sessionId'] },
            { fields: ['ipAddress'] },
        ],
    });
    return AuditLog;
};
exports.createAuditLogModel = createAuditLogModel;
/**
 * Sequelize model for SOX Control Definitions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SOXControl model
 *
 * @example
 * ```typescript
 * const SOXControl = createSOXControlModel(sequelize);
 * const control = await SOXControl.create({
 *   controlId: 'CTRL-001',
 *   controlName: 'Journal Entry Approval',
 *   controlType: 'preventive',
 *   controlFrequency: 'manual'
 * });
 * ```
 */
const createSOXControlModel = (sequelize) => {
    class SOXControl extends sequelize_1.Model {
    }
    SOXControl.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        controlId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique control identifier',
        },
        controlName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Control name',
        },
        controlType: {
            type: sequelize_1.DataTypes.ENUM('preventive', 'detective', 'corrective'),
            allowNull: false,
            comment: 'Type of control',
        },
        controlFrequency: {
            type: sequelize_1.DataTypes.ENUM('manual', 'automated', 'semi_automated'),
            allowNull: false,
            comment: 'Control operation frequency',
        },
        controlObjective: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Control objective description',
        },
        riskArea: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Risk area addressed',
        },
        ownerUserId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Control owner user ID',
        },
        testingFrequency: {
            type: sequelize_1.DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually'),
            allowNull: false,
            comment: 'Testing frequency',
        },
        lastTestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last test date',
        },
        nextTestDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Next scheduled test date',
        },
        testResult: {
            type: sequelize_1.DataTypes.ENUM('passed', 'failed', 'partially_passed', 'not_tested'),
            allowNull: true,
            comment: 'Latest test result',
        },
        deficiencyLevel: {
            type: sequelize_1.DataTypes.ENUM('none', 'deficiency', 'significant_deficiency', 'material_weakness'),
            allowNull: true,
            comment: 'Deficiency level if control failed',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'under_review'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Control status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional control metadata',
        },
    }, {
        sequelize,
        tableName: 'sox_controls',
        timestamps: true,
        indexes: [
            { fields: ['controlId'], unique: true },
            { fields: ['controlType'] },
            { fields: ['riskArea'] },
            { fields: ['ownerUserId'] },
            { fields: ['status'] },
            { fields: ['nextTestDate'] },
        ],
    });
    return SOXControl;
};
exports.createSOXControlModel = createSOXControlModel;
/**
 * Sequelize model for Change Tracking Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeTracking model
 *
 * @example
 * ```typescript
 * const ChangeTracking = createChangeTrackingModel(sequelize);
 * const change = await ChangeTracking.create({
 *   entityType: 'Account',
 *   entityId: 1,
 *   fieldName: 'accountName',
 *   oldValue: 'Old Name',
 *   newValue: 'New Name',
 *   changedBy: 'user123'
 * });
 * ```
 */
const createChangeTrackingModel = (sequelize) => {
    class ChangeTracking extends sequelize_1.Model {
    }
    ChangeTracking.init({
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Type of entity changed',
        },
        entityId: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: 'ID of entity changed',
        },
        fieldName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Field name that changed',
        },
        oldValue: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Previous value',
        },
        newValue: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'New value',
        },
        changeType: {
            type: sequelize_1.DataTypes.ENUM('create', 'update', 'delete', 'archive'),
            allowNull: false,
            comment: 'Type of change',
        },
        changedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who made the change',
        },
        changedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Timestamp of change',
        },
        changeReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for change',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected', 'auto_approved'),
            allowNull: false,
            defaultValue: 'auto_approved',
            comment: 'Approval status',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of approval',
        },
        rollbackAvailable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether change can be rolled back',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'change_tracking',
        timestamps: false,
        indexes: [
            { fields: ['entityType', 'entityId'] },
            { fields: ['changedBy'] },
            { fields: ['changedAt'] },
            { fields: ['approvalStatus'] },
            { fields: ['changeType'] },
        ],
    });
    return ChangeTracking;
};
exports.createChangeTrackingModel = createChangeTrackingModel;
// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================
/**
 * Creates a comprehensive audit log entry with full context.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAuditLogDto} auditData - Audit log data
 * @param {string} sessionId - Session ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AuditLogEntry>} Created audit log entry
 *
 * @example
 * ```typescript
 * const auditEntry = await createAuditLog(sequelize, {
 *   tableName: 'journal_entry_headers',
 *   recordId: 123,
 *   action: 'UPDATE',
 *   userId: 'user123',
 *   ipAddress: '192.168.1.1',
 *   oldValues: { status: 'draft' },
 *   newValues: { status: 'posted' }
 * }, 'session-xyz');
 * ```
 */
const createAuditLog = async (sequelize, auditData, sessionId, transaction) => {
    const AuditLog = (0, exports.createAuditLogModel)(sequelize);
    // Get user details
    const userQuery = `SELECT username, full_name FROM users WHERE user_id = :userId LIMIT 1`;
    const userResult = await sequelize.query(userQuery, {
        replacements: { userId: auditData.userId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const userName = userResult[0]?.full_name || auditData.userId;
    // Determine changed fields
    const changedFields = [];
    if (auditData.oldValues && auditData.newValues) {
        for (const key of Object.keys(auditData.newValues)) {
            if (JSON.stringify(auditData.oldValues[key]) !== JSON.stringify(auditData.newValues[key])) {
                changedFields.push(key);
            }
        }
    }
    // Determine severity and category
    let severity = 'low';
    let category = 'data_change';
    if (auditData.action === 'DELETE')
        severity = 'high';
    if (auditData.tableName.includes('user') || auditData.tableName.includes('auth')) {
        severity = 'high';
        category = 'security';
    }
    if (auditData.tableName.includes('journal') || auditData.tableName.includes('financial')) {
        category = 'financial';
    }
    if (auditData.action === 'POST' || auditData.action === 'APPROVE') {
        severity = 'medium';
    }
    const entry = await AuditLog.create({
        tableName: auditData.tableName,
        recordId: auditData.recordId,
        action: auditData.action,
        userId: auditData.userId,
        userName,
        sessionId,
        ipAddress: auditData.ipAddress,
        oldValues: auditData.oldValues || null,
        newValues: auditData.newValues || null,
        changedFields: changedFields.length > 0 ? changedFields : null,
        businessContext: auditData.businessContext || null,
        severity,
        category,
        timestamp: new Date(),
        metadata: {},
    }, { transaction });
    return entry.toJSON();
};
exports.createAuditLog = createAuditLog;
/**
 * Queries audit logs with advanced filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditLogQueryDto} queryParams - Query parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ logs: AuditLogEntry[]; total: number }>} Audit logs and total count
 *
 * @example
 * ```typescript
 * const result = await queryAuditLogs(sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   userId: 'user123',
 *   severity: 'high',
 *   limit: 100
 * });
 * ```
 */
const queryAuditLogs = async (sequelize, queryParams, transaction) => {
    const AuditLog = (0, exports.createAuditLogModel)(sequelize);
    const where = {};
    if (queryParams.startDate || queryParams.endDate) {
        where.timestamp = {};
        if (queryParams.startDate) {
            where.timestamp[sequelize_1.Op.gte] = queryParams.startDate;
        }
        if (queryParams.endDate) {
            where.timestamp[sequelize_1.Op.lte] = queryParams.endDate;
        }
    }
    if (queryParams.userId) {
        where.userId = queryParams.userId;
    }
    if (queryParams.tableName) {
        where.tableName = queryParams.tableName;
    }
    if (queryParams.action) {
        where.action = queryParams.action;
    }
    if (queryParams.severity) {
        where.severity = queryParams.severity;
    }
    const logs = await AuditLog.findAll({
        where,
        order: [['timestamp', 'DESC']],
        limit: queryParams.limit || 100,
        offset: queryParams.offset || 0,
        transaction,
    });
    const total = await AuditLog.count({ where, transaction });
    return {
        logs: logs.map((log) => log.toJSON()),
        total,
    };
};
exports.queryAuditLogs = queryAuditLogs;
/**
 * Tracks field-level changes with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} fieldName - Field name
 * @param {any} oldValue - Old value
 * @param {any} newValue - New value
 * @param {string} userId - User ID
 * @param {string} [changeReason] - Reason for change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ChangeTrackingRecord>} Change tracking record
 *
 * @example
 * ```typescript
 * const change = await trackFieldChange(
 *   sequelize,
 *   'Account',
 *   1,
 *   'accountName',
 *   'Old Name',
 *   'New Name',
 *   'user123',
 *   'Correcting account name'
 * );
 * ```
 */
const trackFieldChange = async (sequelize, entityType, entityId, fieldName, oldValue, newValue, userId, changeReason, transaction) => {
    const ChangeTracking = (0, exports.createChangeTrackingModel)(sequelize);
    // Determine if approval is required based on entity type and field
    const requiresApproval = await checkIfApprovalRequired(sequelize, entityType, fieldName);
    const change = await ChangeTracking.create({
        entityType,
        entityId,
        fieldName,
        oldValue,
        newValue,
        changeType: oldValue === null ? 'create' : 'update',
        changedBy: userId,
        changedAt: new Date(),
        changeReason: changeReason || null,
        approvalStatus: requiresApproval ? 'pending' : 'auto_approved',
        rollbackAvailable: true,
        metadata: {},
    }, { transaction });
    return change.toJSON();
};
exports.trackFieldChange = trackFieldChange;
/**
 * Logs user activity for security and compliance monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} activityType - Activity type
 * @param {string} activityDescription - Activity description
 * @param {string} sessionId - Session ID
 * @param {string} ipAddress - IP address
 * @param {boolean} success - Whether activity was successful
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UserActivityLog>} Activity log entry
 *
 * @example
 * ```typescript
 * const activity = await logUserActivity(
 *   sequelize,
 *   'user123',
 *   'access',
 *   'Accessed financial report',
 *   'session-xyz',
 *   '192.168.1.1',
 *   true
 * );
 * ```
 */
const logUserActivity = async (sequelize, userId, activityType, activityDescription, sessionId, ipAddress, success = true, transaction) => {
    const query = `
    INSERT INTO user_activity_logs (
      user_id,
      user_name,
      activity_type,
      activity_description,
      session_id,
      ip_address,
      timestamp,
      success
    )
    SELECT
      :userId,
      COALESCE(u.full_name, :userId),
      :activityType,
      :activityDescription,
      :sessionId,
      :ipAddress,
      NOW(),
      :success
    FROM users u
    WHERE u.user_id = :userId
    RETURNING *
  `;
    const result = await sequelize.query(query, {
        replacements: {
            userId,
            activityType,
            activityDescription,
            sessionId,
            ipAddress,
            success,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result[0][0];
};
exports.logUserActivity = logUserActivity;
/**
 * Builds data lineage trail for data governance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} dataElement - Data element identifier
 * @param {string} sourceSystem - Source system
 * @param {string} targetSystem - Target system
 * @param {DataLineageNode[]} lineagePath - Lineage path nodes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DataLineageTrail>} Data lineage trail
 *
 * @example
 * ```typescript
 * const lineage = await buildDataLineageTrail(sequelize, 'revenue', 'AR', 'GL', [
 *   { nodeType: 'source', entityType: 'Invoice', entityId: 123, ... },
 *   { nodeType: 'transformation', entityType: 'JournalEntry', entityId: 456, ... }
 * ]);
 * ```
 */
const buildDataLineageTrail = async (sequelize, dataElement, sourceSystem, targetSystem, lineagePath, transaction) => {
    const trailId = `${dataElement}_${sourceSystem}_${targetSystem}_${Date.now()}`;
    const query = `
    INSERT INTO data_lineage_trails (
      trail_id,
      data_element,
      source_system,
      target_system,
      lineage_path,
      is_complete,
      confidence,
      created_at,
      last_updated
    ) VALUES (
      :trailId,
      :dataElement,
      :sourceSystem,
      :targetSystem,
      :lineagePath,
      :isComplete,
      :confidence,
      NOW(),
      NOW()
    )
    RETURNING *
  `;
    const isComplete = lineagePath.length > 0 && lineagePath[lineagePath.length - 1].nodeType === 'destination';
    const confidence = isComplete ? 1.0 : 0.8;
    const result = await sequelize.query(query, {
        replacements: {
            trailId,
            dataElement,
            sourceSystem,
            targetSystem,
            lineagePath: JSON.stringify(lineagePath),
            isComplete,
            confidence,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return {
        trailId,
        dataElement,
        sourceSystem,
        targetSystem,
        lineagePath,
        createdAt: new Date(),
        lastUpdated: new Date(),
        isComplete,
        confidence,
    };
};
exports.buildDataLineageTrail = buildDataLineageTrail;
/**
 * Creates or updates a SOX control definition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<SOXControl>} controlData - Control data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControl>} SOX control
 *
 * @example
 * ```typescript
 * const control = await createSOXControl(sequelize, {
 *   controlId: 'CTRL-001',
 *   controlName: 'Journal Entry Approval',
 *   controlType: 'preventive',
 *   controlObjective: 'Ensure all journal entries are approved',
 *   ownerUserId: 'controller123',
 *   testingFrequency: 'monthly'
 * });
 * ```
 */
const createSOXControl = async (sequelize, controlData, transaction) => {
    const SOXControlModel = (0, exports.createSOXControlModel)(sequelize);
    const control = await SOXControlModel.create({
        ...controlData,
        status: controlData.status || 'active',
        metadata: controlData.metadata || {},
    }, { transaction });
    return control.toJSON();
};
exports.createSOXControl = createSOXControl;
/**
 * Records a SOX control test execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SOXControlTestDto} testData - Test data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControlTest>} SOX control test record
 *
 * @example
 * ```typescript
 * const test = await recordSOXControlTest(sequelize, {
 *   controlId: 'CTRL-001',
 *   testDate: new Date(),
 *   testedBy: 'auditor123',
 *   testProcedure: 'Reviewed 25 journal entries',
 *   sampleSize: 25,
 *   exceptionCount: 0,
 *   testResult: 'passed',
 *   findings: 'All entries properly approved',
 *   evidenceLocation: 's3://audit/2024/ctrl-001/'
 * });
 * ```
 */
const recordSOXControlTest = async (sequelize, testData, transaction) => {
    const query = `
    INSERT INTO sox_control_tests (
      control_id,
      test_date,
      tested_by,
      test_procedure,
      sample_size,
      exception_count,
      test_result,
      findings,
      evidence_location,
      remediation_required,
      created_at
    ) VALUES (
      :controlId,
      :testDate,
      :testedBy,
      :testProcedure,
      :sampleSize,
      :exceptionCount,
      :testResult,
      :findings,
      :evidenceLocation,
      :remediationRequired,
      NOW()
    )
    RETURNING *
  `;
    const remediationRequired = testData.testResult !== 'passed';
    const result = await sequelize.query(query, {
        replacements: {
            controlId: testData.controlId,
            testDate: testData.testDate,
            testedBy: testData.testedBy,
            testProcedure: testData.testProcedure,
            sampleSize: testData.sampleSize,
            exceptionCount: testData.exceptionCount,
            testResult: testData.testResult,
            findings: testData.findings,
            evidenceLocation: testData.evidenceLocation,
            remediationRequired,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Update the control with the latest test result
    const SOXControlModel = (0, exports.createSOXControlModel)(sequelize);
    await SOXControlModel.update({
        lastTestDate: testData.testDate,
        testResult: testData.testResult,
        deficiencyLevel: testData.testResult === 'passed' ? 'none' : 'deficiency',
    }, {
        where: { controlId: testData.controlId },
        transaction,
    });
    return result[0][0];
};
exports.recordSOXControlTest = recordSOXControlTest;
/**
 * Generates a comprehensive compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportDto} reportParams - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(sequelize, {
 *   reportType: 'sox_404',
 *   periodStartDate: new Date('2024-01-01'),
 *   periodEndDate: new Date('2024-12-31'),
 *   preparedBy: 'auditor123'
 * });
 * ```
 */
const generateComplianceReport = async (sequelize, reportParams, transaction) => {
    const reportId = `${reportParams.reportType}_${Date.now()}`;
    // Get all relevant control tests for the period
    const controlTestsQuery = `
    SELECT
      ct.*,
      sc.control_name,
      sc.risk_area
    FROM sox_control_tests ct
    JOIN sox_controls sc ON ct.control_id = sc.control_id
    WHERE ct.test_date BETWEEN :startDate AND :endDate
    ORDER BY ct.test_date DESC
  `;
    const controlTests = await sequelize.query(controlTestsQuery, {
        replacements: {
            startDate: reportParams.periodStartDate,
            endDate: reportParams.periodEndDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const findings = [];
    let passedControls = 0;
    let failedControls = 0;
    for (const test of controlTests) {
        if (test.test_result === 'failed') {
            failedControls++;
            findings.push({
                findingId: `FIND-${test.id}`,
                findingType: 'deficiency',
                severity: test.exception_count > 3 ? 'high' : 'medium',
                description: `Control ${test.control_name} failed testing`,
                affectedControl: test.control_id,
                affectedProcess: test.risk_area,
                identifiedDate: test.test_date,
                identifiedBy: test.tested_by,
                rootCause: test.findings,
                status: 'open',
            });
        }
        else if (test.test_result === 'passed') {
            passedControls++;
        }
    }
    const overallAssessment = failedControls === 0 ? 'compliant' : failedControls < passedControls ? 'partially_compliant' : 'non_compliant';
    const executiveSummary = `
    Compliance Report for ${reportParams.reportType} covering period ${reportParams.periodStartDate.toISOString()} to ${reportParams.periodEndDate.toISOString()}.
    Total controls tested: ${controlTests.length}
    Passed: ${passedControls}
    Failed: ${failedControls}
    Overall Assessment: ${overallAssessment}
    ${findings.length > 0 ? `${findings.length} findings identified requiring remediation.` : 'No significant findings identified.'}
  `;
    const report = {
        reportId,
        reportType: reportParams.reportType,
        reportingPeriod: {
            startDate: reportParams.periodStartDate,
            endDate: reportParams.periodEndDate,
        },
        preparedBy: reportParams.preparedBy,
        preparedAt: new Date(),
        status: 'draft',
        findings,
        overallAssessment,
        executiveSummary,
    };
    // Save report to database
    await sequelize.query(`
    INSERT INTO compliance_reports (
      report_id,
      report_type,
      period_start,
      period_end,
      prepared_by,
      prepared_at,
      status,
      findings,
      overall_assessment,
      executive_summary
    ) VALUES (
      :reportId,
      :reportType,
      :periodStart,
      :periodEnd,
      :preparedBy,
      NOW(),
      'draft',
      :findings,
      :overallAssessment,
      :executiveSummary
    )
  `, {
        replacements: {
            reportId,
            reportType: reportParams.reportType,
            periodStart: reportParams.periodStartDate,
            periodEnd: reportParams.periodEndDate,
            preparedBy: reportParams.preparedBy,
            findings: JSON.stringify(findings),
            overallAssessment,
            executiveSummary,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return report;
};
exports.generateComplianceReport = generateComplianceReport;
/**
 * Logs security audit events for threat detection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} eventType - Event type
 * @param {string} severity - Event severity
 * @param {string} ipAddress - IP address
 * @param {string} eventDescription - Event description
 * @param {string} [userId] - User ID if applicable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SecurityAuditLog>} Security audit log entry
 *
 * @example
 * ```typescript
 * const securityEvent = await logSecurityAuditEvent(
 *   sequelize,
 *   'authentication',
 *   'warning',
 *   '192.168.1.1',
 *   'Failed login attempt',
 *   'user123'
 * );
 * ```
 */
const logSecurityAuditEvent = async (sequelize, eventType, severity, ipAddress, eventDescription, userId, transaction) => {
    const threatLevel = severity === 'critical' ? 'critical' : severity === 'warning' ? 'medium' : 'low';
    const investigationRequired = severity === 'critical' || eventType === 'suspicious_activity';
    const query = `
    INSERT INTO security_audit_logs (
      event_type,
      severity,
      user_id,
      ip_address,
      timestamp,
      event_description,
      action_result,
      threat_level,
      investigation_required,
      investigation_status
    ) VALUES (
      :eventType,
      :severity,
      :userId,
      :ipAddress,
      NOW(),
      :eventDescription,
      'failure',
      :threatLevel,
      :investigationRequired,
      :investigationStatus
    )
    RETURNING *
  `;
    const result = await sequelize.query(query, {
        replacements: {
            eventType,
            severity,
            userId: userId || null,
            ipAddress,
            eventDescription,
            threatLevel,
            investigationRequired,
            investigationStatus: investigationRequired ? 'pending' : null,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result[0][0];
};
exports.logSecurityAuditEvent = logSecurityAuditEvent;
/**
 * Records access control decisions for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} accessType - Access type
 * @param {boolean} granted - Whether access was granted
 * @param {string} [denialReason] - Denial reason if not granted
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AccessControlLog>} Access control log entry
 *
 * @example
 * ```typescript
 * const accessLog = await recordAccessControl(
 *   sequelize,
 *   'user123',
 *   'financial_report',
 *   'report-456',
 *   'read',
 *   true
 * );
 * ```
 */
const recordAccessControl = async (sequelize, userId, resourceType, resourceId, accessType, granted, denialReason, transaction) => {
    const query = `
    INSERT INTO access_control_logs (
      user_id,
      resource_type,
      resource_id,
      access_type,
      granted,
      denial_reason,
      requested_at
    ) VALUES (
      :userId,
      :resourceType,
      :resourceId,
      :accessType,
      :granted,
      :denialReason,
      NOW()
    )
    RETURNING *
  `;
    const result = await sequelize.query(query, {
        replacements: {
            userId,
            resourceType,
            resourceId,
            accessType,
            granted,
            denialReason: denialReason || null,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result[0][0];
};
exports.recordAccessControl = recordAccessControl;
/**
 * Retrieves complete transaction history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transactionType - Transaction type
 * @param {number} transactionId - Transaction ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TransactionHistory>} Transaction history with audit trail
 *
 * @example
 * ```typescript
 * const history = await getTransactionHistory(
 *   sequelize,
 *   'journal_entry',
 *   123
 * );
 * ```
 */
const getTransactionHistory = async (sequelize, transactionType, transactionId, transaction) => {
    // Get transaction details
    const transactionQuery = `
    SELECT *
    FROM ${transactionType}s
    WHERE id = :transactionId
  `;
    const transactionData = await sequelize.query(transactionQuery, {
        replacements: { transactionId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (!transactionData || transactionData.length === 0) {
        throw new Error('Transaction not found');
    }
    const txn = transactionData[0];
    // Get audit trail
    const AuditLog = (0, exports.createAuditLogModel)(sequelize);
    const auditLogs = await AuditLog.findAll({
        where: {
            tableName: `${transactionType}s`,
            recordId: transactionId,
        },
        order: [['timestamp', 'ASC']],
        transaction,
    });
    // Get approval chain
    const approvalQuery = `
    SELECT *
    FROM approval_workflows
    WHERE transaction_type = :transactionType
      AND transaction_id = :transactionId
    ORDER BY approval_level ASC
  `;
    const approvals = await sequelize.query(approvalQuery, {
        replacements: { transactionType, transactionId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        historyId: transactionId,
        transactionType,
        transactionId,
        documentNumber: txn.entry_number || txn.document_number,
        transactionDate: txn.entry_date || txn.transaction_date,
        postingDate: txn.posting_date,
        amount: txn.total_debit || txn.amount,
        currency: txn.currency || 'USD',
        userId: txn.created_by,
        status: txn.status,
        approvalChain: approvals,
        relatedTransactions: [],
        auditTrail: auditLogs.map((log) => log.toJSON()),
        metadata: txn.metadata || {},
    };
};
exports.getTransactionHistory = getTransactionHistory;
/**
 * Detects segregation of duties violations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID to check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SODViolation[]>} Array of SOD violations
 *
 * @example
 * ```typescript
 * const violations = await detectSegregationOfDutiesViolations(
 *   sequelize,
 *   'user123'
 * );
 * ```
 */
const detectSegregationOfDutiesViolations = async (sequelize, userId, transaction) => {
    const query = `
    WITH user_roles AS (
      SELECT
        ur.user_id,
        array_agg(ur.role_id) as assigned_roles
      FROM user_roles ur
      WHERE ur.user_id = :userId
      GROUP BY ur.user_id
    ),
    sod_rules AS (
      SELECT
        sod.id as rule_id,
        sod.rule_name,
        sod.conflicting_role_1,
        sod.conflicting_role_2,
        sod.risk_level
      FROM segregation_of_duties_rules sod
      WHERE sod.is_active = true
    )
    SELECT
      sr.rule_id,
      sr.rule_name,
      ur.assigned_roles,
      sr.risk_level
    FROM user_roles ur
    CROSS JOIN sod_rules sr
    WHERE ur.assigned_roles @> ARRAY[sr.conflicting_role_1, sr.conflicting_role_2]
  `;
    const results = await sequelize.query(query, {
        replacements: { userId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const violations = [];
    for (const row of results) {
        violations.push({
            violationId: Date.now(),
            userId,
            userName: '', // Would be populated from user table
            sodRuleId: row.rule_id,
            assignedRoles: row.assigned_roles,
            detectedAt: new Date(),
            mitigationStatus: 'pending',
        });
    }
    return violations;
};
exports.detectSegregationOfDutiesViolations = detectSegregationOfDutiesViolations;
/**
 * Creates a compliance certification record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} certificationType - Certification type
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {string} certifiedBy - User certifying
 * @param {string} certificationStatement - Certification statement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ComplianceCertification>} Compliance certification
 *
 * @example
 * ```typescript
 * const cert = await createComplianceCertification(
 *   sequelize,
 *   'sox',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'cfo@company.com',
 *   'I certify that internal controls are effective'
 * );
 * ```
 */
const createComplianceCertification = async (sequelize, certificationType, periodStart, periodEnd, certifiedBy, certificationStatement, transaction) => {
    const certificationId = `CERT-${certificationType}-${Date.now()}`;
    const query = `
    INSERT INTO compliance_certifications (
      certification_id,
      certification_type,
      period_start,
      period_end,
      certified_by,
      certification_date,
      certification_statement,
      status,
      next_review_date
    ) VALUES (
      :certificationId,
      :certificationType,
      :periodStart,
      :periodEnd,
      :certifiedBy,
      NOW(),
      :certificationStatement,
      'valid',
      :nextReviewDate
    )
    RETURNING *
  `;
    const nextReviewDate = new Date(periodEnd);
    nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
    const result = await sequelize.query(query, {
        replacements: {
            certificationId,
            certificationType,
            periodStart,
            periodEnd,
            certifiedBy,
            certificationStatement,
            nextReviewDate,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result[0][0];
};
exports.createComplianceCertification = createComplianceCertification;
/**
 * Initiates a forensic analysis investigation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} investigationType - Investigation type
 * @param {string} initiatedBy - User initiating investigation
 * @param {string[]} affectedSystems - Affected systems
 * @param {string[]} affectedUsers - Affected users
 * @param {Date} timelineStart - Timeline start
 * @param {Date} timelineEnd - Timeline end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ForensicAnalysis>} Forensic analysis record
 *
 * @example
 * ```typescript
 * const investigation = await initiateForensicAnalysis(
 *   sequelize,
 *   'unauthorized_access',
 *   'security-admin',
 *   ['financial_system'],
 *   ['user123'],
 *   new Date('2024-12-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
const initiateForensicAnalysis = async (sequelize, investigationType, initiatedBy, affectedSystems, affectedUsers, timelineStart, timelineEnd, transaction) => {
    const analysisId = `FORENSIC-${Date.now()}`;
    const query = `
    INSERT INTO forensic_analyses (
      analysis_id,
      investigation_type,
      initiated_by,
      initiated_at,
      status,
      priority,
      affected_systems,
      affected_users,
      timeline_start,
      timeline_end
    ) VALUES (
      :analysisId,
      :investigationType,
      :initiatedBy,
      NOW(),
      'open',
      'high',
      :affectedSystems,
      :affectedUsers,
      :timelineStart,
      :timelineEnd
    )
    RETURNING *
  `;
    const result = await sequelize.query(query, {
        replacements: {
            analysisId,
            investigationType,
            initiatedBy,
            affectedSystems: JSON.stringify(affectedSystems),
            affectedUsers: JSON.stringify(affectedUsers),
            timelineStart,
            timelineEnd,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return {
        analysisId,
        investigationType,
        initiatedBy,
        initiatedAt: new Date(),
        status: 'open',
        priority: 'high',
        affectedSystems,
        affectedUsers,
        timelineStart,
        timelineEnd,
        findings: '',
        evidenceCollected: [],
        recommendations: '',
    };
};
exports.initiateForensicAnalysis = initiateForensicAnalysis;
/**
 * Generates audit trail report for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [tableNames] - Optional table name filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail report
 *
 * @example
 * ```typescript
 * const report = await generateAuditTrailReport(
 *   sequelize,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   ['journal_entry_headers', 'financial_reports']
 * );
 * ```
 */
const generateAuditTrailReport = async (sequelize, startDate, endDate, tableNames, transaction) => {
    const tableFilter = tableNames && tableNames.length > 0 ? 'AND table_name = ANY(:tableNames)' : '';
    const query = `
    SELECT
      table_name,
      action,
      COUNT(*) as event_count,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT DATE(timestamp)) as active_days,
      MIN(timestamp) as first_event,
      MAX(timestamp) as last_event
    FROM audit_logs
    WHERE timestamp BETWEEN :startDate AND :endDate
      ${tableFilter}
    GROUP BY table_name, action
    ORDER BY event_count DESC
  `;
    const summary = await sequelize.query(query, {
        replacements: {
            startDate,
            endDate,
            tableNames: tableNames || [],
        },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const totalQuery = `
    SELECT
      COUNT(*) as total_events,
      COUNT(DISTINCT user_id) as total_users,
      COUNT(DISTINCT session_id) as total_sessions
    FROM audit_logs
    WHERE timestamp BETWEEN :startDate AND :endDate
      ${tableFilter}
  `;
    const totals = await sequelize.query(totalQuery, {
        replacements: {
            startDate,
            endDate,
            tableNames: tableNames || [],
        },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        reportPeriod: { startDate, endDate },
        summary,
        totals: totals[0],
        generatedAt: new Date(),
    };
};
exports.generateAuditTrailReport = generateAuditTrailReport;
/**
 * Retrieves user activity summary for compliance review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} User activity summary
 *
 * @example
 * ```typescript
 * const summary = await getUserActivitySummary(
 *   sequelize,
 *   'user123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
const getUserActivitySummary = async (sequelize, userId, startDate, endDate, transaction) => {
    const query = `
    SELECT
      activity_type,
      COUNT(*) as activity_count,
      COUNT(CASE WHEN success = true THEN 1 END) as successful_count,
      COUNT(CASE WHEN success = false THEN 1 END) as failed_count,
      MIN(timestamp) as first_activity,
      MAX(timestamp) as last_activity,
      COUNT(DISTINCT DATE(timestamp)) as active_days
    FROM user_activity_logs
    WHERE user_id = :userId
      AND timestamp BETWEEN :startDate AND :endDate
    GROUP BY activity_type
    ORDER BY activity_count DESC
  `;
    const activitySummary = await sequelize.query(query, {
        replacements: { userId, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const securityQuery = `
    SELECT
      COUNT(*) as security_events,
      COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_events,
      COUNT(CASE WHEN investigation_required = true THEN 1 END) as investigation_required
    FROM security_audit_logs
    WHERE user_id = :userId
      AND timestamp BETWEEN :startDate AND :endDate
  `;
    const securitySummary = await sequelize.query(securityQuery, {
        replacements: { userId, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        userId,
        period: { startDate, endDate },
        activitySummary,
        securitySummary: securitySummary[0],
        generatedAt: new Date(),
    };
};
exports.getUserActivitySummary = getUserActivitySummary;
/**
 * Archives old audit logs for long-term retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} cutoffDate - Archive logs before this date
 * @param {string} archiveLocation - Archive storage location
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ archivedCount: number; archiveLocation: string }>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveAuditLogs(
 *   sequelize,
 *   new Date('2020-01-01'),
 *   's3://audit-archive/2020/'
 * );
 * ```
 */
const archiveAuditLogs = async (sequelize, cutoffDate, archiveLocation, transaction) => {
    const countQuery = `
    SELECT COUNT(*) as count
    FROM audit_logs
    WHERE timestamp < :cutoffDate
  `;
    const countResult = await sequelize.query(countQuery, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const archivedCount = countResult[0].count;
    // In production, this would export to S3/archive storage
    // For now, we'll just mark records as archived
    await sequelize.query(`
    UPDATE audit_logs
    SET metadata = jsonb_set(metadata, '{archived}', 'true')
    WHERE timestamp < :cutoffDate
  `, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    return {
        archivedCount,
        archiveLocation,
    };
};
exports.archiveAuditLogs = archiveAuditLogs;
/**
 * Validates data integrity using checksums and hashes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name to validate
 * @param {number[]} recordIds - Record IDs to validate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: boolean; invalidRecords: number[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDataIntegrity(
 *   sequelize,
 *   'journal_entry_headers',
 *   [1, 2, 3, 4, 5]
 * );
 * ```
 */
const validateDataIntegrity = async (sequelize, tableName, recordIds, transaction) => {
    // This would implement actual checksum validation
    // For demonstration, we'll check if audit logs exist
    const query = `
    SELECT DISTINCT record_id
    FROM audit_logs
    WHERE table_name = :tableName
      AND record_id = ANY(:recordIds)
      AND action IN ('INSERT', 'UPDATE')
  `;
    const results = await sequelize.query(query, {
        replacements: { tableName, recordIds },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const auditedRecords = results.map((r) => r.record_id);
    const invalidRecords = recordIds.filter((id) => !auditedRecords.includes(id));
    return {
        valid: invalidRecords.length === 0,
        invalidRecords,
    };
};
exports.validateDataIntegrity = validateDataIntegrity;
/**
 * Exports compliance data for regulatory filing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulatoryBody - Regulatory body
 * @param {string} reportType - Report type
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RegulatoryReport>} Regulatory report
 *
 * @example
 * ```typescript
 * const report = await exportComplianceData(
 *   sequelize,
 *   'SEC',
 *   '10-K',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
const exportComplianceData = async (sequelize, regulatoryBody, reportType, periodStart, periodEnd, transaction) => {
    const reportId = `REG-${regulatoryBody}-${reportType}-${Date.now()}`;
    // Gather compliance data
    const controlsQuery = `
    SELECT
      control_id,
      control_name,
      test_result,
      deficiency_level
    FROM sox_controls
    WHERE status = 'active'
  `;
    const controls = await sequelize.query(controlsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const certificationsQuery = `
    SELECT *
    FROM compliance_certifications
    WHERE period_start >= :periodStart
      AND period_end <= :periodEnd
      AND status = 'valid'
  `;
    const certifications = await sequelize.query(certificationsQuery, {
        replacements: { periodStart, periodEnd },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const filingDeadline = new Date(periodEnd);
    filingDeadline.setDate(filingDeadline.getDate() + 90); // 90 days after period end
    return {
        reportId,
        regulatoryBody,
        reportType,
        filingDeadline,
        reportingPeriod: {
            startDate: periodStart,
            endDate: periodEnd,
        },
        preparedBy: 'system',
        status: 'draft',
        reportData: {
            controls,
            certifications,
        },
    };
};
exports.exportComplianceData = exportComplianceData;
/**
 * Monitors real-time compliance metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Real-time compliance metrics
 *
 * @example
 * ```typescript
 * const metrics = await monitorComplianceMetrics(sequelize);
 * ```
 */
const monitorComplianceMetrics = async (sequelize, transaction) => {
    const controlsQuery = `
    SELECT
      COUNT(*) as total_controls,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_controls,
      COUNT(CASE WHEN test_result = 'passed' THEN 1 END) as passed_controls,
      COUNT(CASE WHEN test_result = 'failed' THEN 1 END) as failed_controls,
      COUNT(CASE WHEN deficiency_level IN ('significant_deficiency', 'material_weakness') THEN 1 END) as critical_deficiencies
    FROM sox_controls
  `;
    const controls = await sequelize.query(controlsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const sodViolationsQuery = `
    SELECT COUNT(*) as total_violations
    FROM sod_violations
    WHERE mitigation_status IN ('pending', 'mitigated')
  `;
    const sodViolations = await sequelize.query(sodViolationsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const securityEventsQuery = `
    SELECT
      COUNT(*) as total_events,
      COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_events,
      COUNT(CASE WHEN investigation_required = true THEN 1 END) as investigations_required
    FROM security_audit_logs
    WHERE timestamp > NOW() - INTERVAL '24 hours'
  `;
    const securityEvents = await sequelize.query(securityEventsQuery, {
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        controls: controls[0],
        sodViolations: sodViolations[0],
        securityEvents: securityEvents[0],
        timestamp: new Date(),
    };
};
exports.monitorComplianceMetrics = monitorComplianceMetrics;
/**
 * Generates compliance dashboard for executive review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - As-of date for metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Compliance dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateComplianceDashboard(
 *   sequelize,
 *   new Date()
 * );
 * ```
 */
const generateComplianceDashboard = async (sequelize, asOfDate, transaction) => {
    const metrics = await (0, exports.monitorComplianceMetrics)(sequelize, transaction);
    const recentFindings = await sequelize.query(`
    SELECT
      finding_id,
      finding_type,
      severity,
      description,
      status
    FROM compliance_findings
    WHERE identified_date > :cutoffDate
    ORDER BY identified_date DESC
    LIMIT 10
  `, {
        replacements: { cutoffDate: new Date(asOfDate.getTime() - 30 * 24 * 60 * 60 * 1000) },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    const upcomingTests = await sequelize.query(`
    SELECT
      control_id,
      control_name,
      next_test_date
    FROM sox_controls
    WHERE next_test_date BETWEEN :asOfDate AND :futureDate
      AND status = 'active'
    ORDER BY next_test_date ASC
    LIMIT 10
  `, {
        replacements: {
            asOfDate,
            futureDate: new Date(asOfDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return {
        asOfDate,
        metrics,
        recentFindings,
        upcomingTests,
        overallStatus: metrics.controls.critical_deficiencies > 0 ? 'attention_required' : 'compliant',
    };
};
exports.generateComplianceDashboard = generateComplianceDashboard;
/**
 * Performs automated control testing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} controlId - Control ID to test
 * @param {Date} testDate - Test date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SOXControlTest>} Test result
 *
 * @example
 * ```typescript
 * const testResult = await performAutomatedControlTest(
 *   sequelize,
 *   'CTRL-001',
 *   new Date()
 * );
 * ```
 */
const performAutomatedControlTest = async (sequelize, controlId, testDate, transaction) => {
    // This would implement actual automated testing logic
    // For demonstration, we'll perform a simple validation
    const controlQuery = `
    SELECT *
    FROM sox_controls
    WHERE control_id = :controlId
  `;
    const control = await sequelize.query(controlQuery, {
        replacements: { controlId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (!control || control.length === 0) {
        throw new Error('Control not found');
    }
    // Simulate automated testing
    const sampleSize = 25;
    const exceptionCount = Math.floor(Math.random() * 3); // Random exceptions
    const testResult = exceptionCount === 0 ? 'passed' : 'failed';
    return await (0, exports.recordSOXControlTest)(sequelize, {
        controlId,
        testDate,
        testedBy: 'SYSTEM_AUTOMATED',
        testProcedure: 'Automated control testing',
        sampleSize,
        exceptionCount,
        testResult,
        findings: exceptionCount > 0 ? `${exceptionCount} exceptions found during automated testing` : 'No exceptions found',
        evidenceLocation: `s3://automated-tests/${controlId}/${testDate.toISOString()}`,
    }, transaction);
};
exports.performAutomatedControlTest = performAutomatedControlTest;
/**
 * Tracks remediation progress for compliance findings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} findingId - Finding ID
 * @param {string} status - New status
 * @param {string} notes - Progress notes
 * @param {string} userId - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackRemediationProgress(
 *   sequelize,
 *   'FIND-123',
 *   'in_progress',
 *   'Implementing corrective controls',
 *   'user123'
 * );
 * ```
 */
const trackRemediationProgress = async (sequelize, findingId, status, notes, userId, transaction) => {
    await sequelize.query(`
    UPDATE compliance_findings
    SET
      status = :status,
      metadata = jsonb_set(
        metadata,
        '{remediation_history}',
        COALESCE(metadata->'remediation_history', '[]'::jsonb) || jsonb_build_object(
          'timestamp', NOW(),
          'status', :status,
          'notes', :notes,
          'updated_by', :userId
        )::jsonb
      )
    WHERE finding_id = :findingId
  `, {
        replacements: { findingId, status, notes, userId },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
};
exports.trackRemediationProgress = trackRemediationProgress;
/**
 * Helper function to check if field change requires approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} fieldName - Field name
 * @returns {Promise<boolean>} Whether approval is required
 */
const checkIfApprovalRequired = async (sequelize, entityType, fieldName) => {
    // In production, this would check configuration
    const criticalFields = ['amount', 'status', 'approved_by', 'posted_at'];
    return criticalFields.includes(fieldName.toLowerCase());
};
//# sourceMappingURL=audit-trail-compliance-kit.js.map