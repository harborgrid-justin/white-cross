"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const audit_log_model_1 = require("../models/audit-log.model");
const audit_logging_service_1 = require("./audit-logging.service");
const audit_query_service_1 = require("./audit-query.service");
const audit_statistics_service_1 = require("./audit-statistics.service");
const audit_compliance_service_1 = require("./audit-compliance.service");
const audit_export_service_1 = require("./audit-export.service");
const audit_retention_service_1 = require("./audit-retention.service");
const base_1 = require("../../common/base");
let AuditService = class AuditService extends base_1.BaseService {
    auditLogModel;
    auditLogging;
    auditQuery;
    auditStatistics;
    auditCompliance;
    auditExport;
    auditRetention;
    constructor(auditLogModel, auditLogging, auditQuery, auditStatistics, auditCompliance, auditExport, auditRetention) {
        super("AuditService");
        this.auditLogModel = auditLogModel;
        this.auditLogging = auditLogging;
        this.auditQuery = auditQuery;
        this.auditStatistics = auditStatistics;
        this.auditCompliance = auditCompliance;
        this.auditExport = auditExport;
        this.auditRetention = auditRetention;
        this.logInfo('Audit service initialized with database support');
    }
    async logCreate(entityType, entityId, context, data, transaction) {
        return this.auditLogging.logCreate(entityType, entityId, context, data, transaction);
    }
    async logRead(entityType, entityId, context, transaction) {
        return this.auditLogging.logRead(entityType, entityId, context, transaction);
    }
    async logUpdate(entityType, entityId, context, changes, transaction) {
        return this.auditLogging.logUpdate(entityType, entityId, context, changes, transaction);
    }
    async logDelete(entityType, entityId, context, data, transaction) {
        return this.auditLogging.logDelete(entityType, entityId, context, data, transaction);
    }
    async logBulkOperation(operation, entityType, context, metadata, transaction) {
        return this.auditLogging.logBulkOperation(operation, entityType, context, metadata, transaction);
    }
    async logExport(entityType, context, metadata) {
        return this.auditLogging.logExport(entityType, context, metadata);
    }
    async logTransaction(operation, context, metadata) {
        return this.auditLogging.logTransaction(operation, context, metadata);
    }
    async logCacheAccess(operation, cacheKey, metadata) {
        return this.auditLogging.logCacheAccess(operation, cacheKey, metadata);
    }
    async logAuthEvent(action, userId, context, success = true, errorMessage) {
        return this.auditLogging.logAuthEvent(action, userId, context, success, errorMessage);
    }
    async logAuthzEvent(action, userId, resource, context, granted, reason) {
        return this.auditLogging.logAuthzEvent(action, userId, resource, context, granted, reason);
    }
    async logSecurityEvent(eventType, description, context, severity = audit_log_model_1.AuditSeverity.HIGH, metadata) {
        return this.auditLogging.logSecurityEvent(eventType, description, context, severity, metadata);
    }
    async logPHIAccess(options, transaction) {
        return this.auditLogging.logPHIAccess(options, transaction);
    }
    async logFailure(action, entityType, entityId, context, errorMessage, metadata) {
        return this.auditLogging.logFailure(action, entityType, entityId, context, errorMessage, metadata);
    }
    async queryAuditLogs(filters = {}, options = {}) {
        return this.auditQuery.queryAuditLogs(filters, options);
    }
    async getEntityAuditHistory(entityType, entityId, options = {}) {
        return this.auditQuery.getEntityAuditHistory(entityType, entityId, options);
    }
    async getUserAuditHistory(userId, options = {}) {
        return this.auditQuery.getUserAuditHistory(userId, options);
    }
    async getPHIAccessLogs(startDate, endDate, options = {}) {
        return this.auditQuery.getPHIAccessLogs(startDate, endDate, options);
    }
    async getAuditStatistics(startDate, endDate) {
        return this.auditStatistics.getAuditStatistics(startDate, endDate);
    }
    async generateComplianceReport(complianceType, startDate, endDate) {
        return this.auditCompliance.generateComplianceReport(complianceType, startDate, endDate);
    }
    async getHIPAAReport(startDate, endDate) {
        return this.auditCompliance.getHIPAAReport(startDate, endDate);
    }
    async getFERPAReport(startDate, endDate) {
        return this.auditCompliance.getFERPAReport(startDate, endDate);
    }
    async exportToCSV(filters = {}, includeFullDetails = false) {
        return this.auditExport.exportToCSV(filters, includeFullDetails);
    }
    async exportToJSON(filters = {}, includeFullDetails = false) {
        return this.auditExport.exportToJSON(filters, includeFullDetails);
    }
    async executeRetentionPolicy(dryRun = true) {
        return this.auditRetention.executeRetentionPolicy(dryRun);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object, audit_logging_service_1.AuditLoggingService,
        audit_query_service_1.AuditQueryService,
        audit_statistics_service_1.AuditStatisticsService,
        audit_compliance_service_1.AuditComplianceService,
        audit_export_service_1.AuditExportService,
        audit_retention_service_1.AuditRetentionService])
], AuditService);
//# sourceMappingURL=audit.service.js.map