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
exports.AuditController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const audit_log_filter_dto_1 = require("./dto/audit-log-filter.dto");
const audit_log_search_dto_1 = require("./dto/audit-log-search.dto");
const date_range_dto_1 = require("./dto/date-range.dto");
const paginated_audit_logs_dto_1 = require("./dto/paginated-audit-logs.dto");
const phi_access_filter_dto_1 = require("./dto/phi-access-filter.dto");
const create_audit_log_dto_1 = require("./dto/create-audit-log.dto");
const create_phi_access_log_dto_1 = require("./dto/create-phi-access-log.dto");
const base_1 = require("../../common/base");
let AuditController = class AuditController extends base_1.BaseController {
    auditService;
    constructor(auditService) {
        super();
        this.auditService = auditService;
    }
    async createAuditLog(createAuditLogDto) {
        await this.auditService.logAction({
            userId: createAuditLogDto.userId,
            action: createAuditLogDto.action,
            entityType: createAuditLogDto.entityType,
            entityId: createAuditLogDto.entityId,
            changes: createAuditLogDto.changes,
            ipAddress: createAuditLogDto.ipAddress,
            userAgent: createAuditLogDto.userAgent,
            success: createAuditLogDto.success,
            errorMessage: createAuditLogDto.errorMessage,
        });
        return {
            success: true,
            message: 'Audit log created successfully',
        };
    }
    async createPHIAccessLog(createPHIAccessLogDto) {
        await this.auditService.logPHIAccess({
            userId: createPHIAccessLogDto.userId,
            action: createPHIAccessLogDto.action,
            entityType: createPHIAccessLogDto.entityType,
            entityId: createPHIAccessLogDto.entityId,
            changes: createPHIAccessLogDto.changes,
            ipAddress: createPHIAccessLogDto.ipAddress,
            userAgent: createPHIAccessLogDto.userAgent,
            success: createPHIAccessLogDto.success,
            errorMessage: createPHIAccessLogDto.errorMessage,
            studentId: createPHIAccessLogDto.studentId,
            accessType: createPHIAccessLogDto.accessType,
            dataCategory: createPHIAccessLogDto.dataCategory,
        });
        return {
            success: true,
            message: 'PHI access log created successfully',
        };
    }
    async getAuditLogs(filters) {
        try {
            return await this.auditService.getAuditLogs({
                ...filters,
                startDate: filters.startDate ? new Date(filters.startDate) : undefined,
                endDate: filters.endDate ? new Date(filters.endDate) : undefined,
            });
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch audit logs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRecentLogs(limit) {
        return this.auditService.getRecentAuditLogs(limit || 50);
    }
    async searchLogs(searchDto) {
        return this.auditService.searchAuditLogs(searchDto);
    }
    async getEntityHistory(entityType, entityId, page, limit) {
        return this.auditService.getEntityAuditHistory(entityType, entityId, page || 1, limit || 20);
    }
    async getUserHistory(userId, page, limit) {
        return this.auditService.getUserAuditHistory(userId, page || 1, limit || 20);
    }
    async getAuditLogById(id) {
        const log = await this.auditService.getAuditLogById(id);
        if (!log) {
            throw new common_1.HttpException('Audit log not found', common_1.HttpStatus.NOT_FOUND);
        }
        return log;
    }
    async getPHIAccessLogs(filters) {
        try {
            return await this.auditService.getPHIAccessLogs({
                ...filters,
                startDate: filters.startDate ? new Date(filters.startDate) : undefined,
                endDate: filters.endDate ? new Date(filters.endDate) : undefined,
            });
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch PHI access logs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStudentPHIAccess(studentId, page, limit) {
        return this.auditService.getStudentPHIAccessLogs(studentId, page || 1, limit || 20);
    }
    async getUserPHIAccess(userId, page, limit) {
        return this.auditService.getUserPHIAccessLogs(userId, page || 1, limit || 20);
    }
    async getComplianceReport(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.getComplianceReport(startDate, endDate);
    }
    async getPHIAccessSummary(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.getPHIAccessSummary(startDate, endDate);
    }
    async getStatistics(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.getAuditStatistics(startDate, endDate);
    }
    async getDashboard(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.getAuditDashboard(startDate, endDate);
    }
    async detectSuspiciousLogins(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.detectSuspiciousLogins(startDate, endDate);
    }
    async getSecurityReport(dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return this.auditService.generateSecurityReport(startDate, endDate);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Post)('log'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create audit log entry',
        description: 'Log a general system action for audit trail compliance'
    }),
    (0, swagger_1.ApiBody)({ type: create_audit_log_dto_1.CreateBasicAuditLogDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Audit log created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid audit log data',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_audit_log_dto_1.CreateBasicAuditLogDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Post)('phi-access'),
    (0, swagger_1.ApiOperation)({
        summary: 'Log PHI access (HIPAA required)',
        description: 'Log access to Protected Health Information for HIPAA compliance'
    }),
    (0, swagger_1.ApiBody)({ type: create_phi_access_log_dto_1.CreatePHIAccessLogDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'PHI access log created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid PHI access log data',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_phi_access_log_dto_1.CreatePHIAccessLogDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "createPHIAccessLog", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs with filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated audit logs',
        type: paginated_audit_logs_dto_1.PaginatedAuditLogsDto,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_filter_dto_1.AuditLogFilterDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('logs/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent audit logs' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recent audit logs' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/audit-log.model").AuditLog] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getRecentLogs", null);
__decorate([
    (0, common_1.Get)('logs/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search audit logs by keyword' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns search results',
        type: paginated_audit_logs_dto_1.PaginatedAuditLogsDto,
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_search_dto_1.AuditLogSearchDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "searchLogs", null);
__decorate([
    (0, common_1.Get)('logs/entity/:type/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit history for a specific entity' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns entity audit history',
        type: paginated_audit_logs_dto_1.PaginatedAuditLogsDto,
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/audit-log.model").AuditLog] }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getEntityHistory", null);
__decorate([
    (0, common_1.Get)('logs/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit history for a specific user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user audit history',
        type: paginated_audit_logs_dto_1.PaginatedAuditLogsDto,
    }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/audit-log.model").AuditLog] }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getUserHistory", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific audit log by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns audit log details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Audit log not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/audit-log.model").AuditLog }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getAuditLogById", null);
__decorate([
    (0, common_1.Get)('phi-access'),
    (0, swagger_1.ApiOperation)({ summary: 'Get PHI access logs with filters (HIPAA)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated PHI access logs',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phi_access_filter_dto_1.PHIAccessFilterDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getPHIAccessLogs", null);
__decorate([
    (0, common_1.Get)('phi-access/student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get PHI access logs for a specific student' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns student PHI access logs' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getStudentPHIAccess", null);
__decorate([
    (0, common_1.Get)('phi-access/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get PHI access logs for a specific user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user PHI access logs' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getUserPHIAccess", null);
__decorate([
    (0, common_1.Get)('compliance/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate HIPAA compliance report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns compliance report' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getComplianceReport", null);
__decorate([
    (0, common_1.Get)('compliance/phi-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get PHI access summary for compliance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns PHI access summary' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getPHIAccessSummary", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns audit statistics' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('statistics/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive audit dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns dashboard statistics' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('security/suspicious-logins'),
    (0, swagger_1.ApiOperation)({ summary: 'Detect suspicious login patterns' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns suspicious login analysis',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "detectSuspiciousLogins", null);
__decorate([
    (0, common_1.Get)('security/report'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate comprehensive security report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns security analysis report' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [date_range_dto_1.DateRangeDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getSecurityReport", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('Audit'),
    (0, common_1.Controller)('audit'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map