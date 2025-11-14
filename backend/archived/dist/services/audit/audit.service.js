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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const audit_log_service_1 = require("./services/audit-log.service");
const audit_query_service_1 = require("../../database/services/audit-query.service");
const audit_statistics_service_1 = require("../../database/services/audit-statistics.service");
const audit_utils_service_1 = require("./services/audit-utils.service");
const compliance_reporting_service_1 = require("./services/compliance-reporting.service");
const phi_access_service_1 = require("./services/phi-access.service");
const security_analysis_service_1 = require("./services/security-analysis.service");
const base_1 = require("../../common/base");
let AuditService = class AuditService extends base_1.BaseService {
    auditLogService;
    phiAccessService;
    auditQueryService;
    complianceService;
    statisticsService;
    securityService;
    utilsService;
    constructor(auditLogService, phiAccessService, auditQueryService, complianceService, statisticsService, securityService, utilsService) {
        super('AuditService');
        this.auditLogService = auditLogService;
        this.phiAccessService = phiAccessService;
        this.auditQueryService = auditQueryService;
        this.complianceService = complianceService;
        this.statisticsService = statisticsService;
        this.securityService = securityService;
        this.utilsService = utilsService;
    }
    async logAction(entry) {
        return this.auditLogService.logAction(entry);
    }
    async logPHIAccess(entry) {
        return this.phiAccessService.logPHIAccess(entry);
    }
    async getAuditLogById(id) {
        return this.auditLogService.getAuditLogById(id);
    }
    async getRecentAuditLogs(limit = 50) {
        return this.auditLogService.getRecentAuditLogs(limit);
    }
    async getAuditLogs(filters = {}) {
        return this.auditQueryService.getAuditLogs(filters);
    }
    async getEntityAuditHistory(entityType, entityId, page = 1, limit = 20) {
        return this.auditQueryService.getEntityAuditHistory(entityType, entityId, page, limit);
    }
    async getUserAuditHistory(userId, page = 1, limit = 20) {
        return this.auditQueryService.getUserAuditHistory(userId, page, limit);
    }
    async searchAuditLogs(criteria) {
        return this.auditQueryService.searchAuditLogs(criteria);
    }
    async getAuditLogsByDateRange(startDate, endDate, page = 1, limit = 50) {
        return this.auditQueryService.getAuditLogsByDateRange(startDate, endDate, page, limit);
    }
    async getPHIAccessLogs(filters = {}) {
        return this.phiAccessService.getPHIAccessLogs(filters);
    }
    async getStudentPHIAccessLogs(studentId, page = 1, limit = 20) {
        return this.phiAccessService.getStudentPHIAccessLogs(studentId, page, limit);
    }
    async getUserPHIAccessLogs(userId, page = 1, limit = 20) {
        return this.phiAccessService.getUserPHIAccessLogs(userId, page, limit);
    }
    async getComplianceReport(startDate, endDate) {
        return this.complianceService.getComplianceReport(startDate, endDate);
    }
    async getPHIAccessSummary(startDate, endDate) {
        return this.complianceService.getPHIAccessSummary(startDate, endDate);
    }
    async getAuditStatistics(startDate, endDate) {
        return this.statisticsService.getAuditStatistics(startDate, endDate);
    }
    async getAuditDashboard(startDate, endDate) {
        return this.statisticsService.getAuditDashboard(startDate, endDate);
    }
    async detectSuspiciousLogins(startDate, endDate) {
        return this.securityService.detectSuspiciousLogins(startDate, endDate);
    }
    async generateSecurityReport(startDate, endDate) {
        return this.securityService.generateSecurityReport(startDate, endDate);
    }
    validateAuditEntry(entry) {
        return this.utilsService.validateAuditEntry(entry);
    }
    validatePHIEntry(entry) {
        return this.utilsService.validatePHIEntry(entry);
    }
    extractIPAddress(req) {
        return this.utilsService.extractIPAddress(req);
    }
    extractUserAgent(req) {
        return this.utilsService.extractUserAgent(req);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService,
        phi_access_service_1.PHIAccessService,
        audit_query_service_1.AuditQueryService,
        compliance_reporting_service_1.ComplianceReportingService,
        audit_statistics_service_1.AuditStatisticsService,
        security_analysis_service_1.SecurityAnalysisService,
        audit_utils_service_1.AuditUtilsService])
], AuditService);
//# sourceMappingURL=audit.service.js.map