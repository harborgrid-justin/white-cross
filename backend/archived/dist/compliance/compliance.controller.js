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
var ComplianceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const execution_context_interface_1 = require("../database/types/execution-context.interface");
const models_1 = require("../database/models");
const audit_service_1 = require("../services/audit/audit.service");
const consent_service_1 = require("./services/consent.service");
const compliance_report_service_1 = require("./services/compliance-report.service");
const checklist_service_1 = require("./services/checklist.service");
const policy_service_1 = require("./services/policy.service");
const data_retention_service_1 = require("./services/data-retention.service");
const violation_service_1 = require("./services/violation.service");
const statistics_service_1 = require("./services/statistics.service");
const create_audit_log_dto_1 = require("./dto/create-audit-log.dto");
const sign_consent_form_dto_1 = require("./dto/sign-consent-form.dto");
const compliance_report_dto_1 = require("./dto/compliance-report.dto");
const checklist_dto_1 = require("./dto/checklist.dto");
const policy_dto_1 = require("./dto/policy.dto");
const data_retention_dto_1 = require("./dto/data-retention.dto");
const violation_dto_1 = require("./dto/violation.dto");
const statistics_dto_1 = require("./dto/statistics.dto");
const base_1 = require("../common/base");
let ComplianceController = ComplianceController_1 = class ComplianceController extends base_1.BaseController {
    auditService;
    consentService;
    reportService;
    checklistService;
    policyService;
    dataRetentionService;
    violationService;
    statisticsService;
    logger = new common_1.Logger(ComplianceController_1.name);
    constructor(auditService, consentService, reportService, checklistService, policyService, dataRetentionService, violationService, statisticsService) {
        super();
        this.auditService = auditService;
        this.consentService = consentService;
        this.reportService = reportService;
        this.checklistService = checklistService;
        this.policyService = policyService;
        this.dataRetentionService = dataRetentionService;
        this.violationService = violationService;
        this.statisticsService = statisticsService;
    }
    async getAuditLogs(page, limit, userId, entityType, action) {
        const filters = {};
        if (userId)
            filters.userId = userId;
        if (entityType)
            filters.entityType = entityType;
        if (action)
            filters.action = action;
        return this.auditService.getAuditLogs(page || 1, limit || 50, filters);
    }
    async getAuditLogById(id) {
        return this.auditService.getAuditLogById(id);
    }
    async createAuditLog(createAuditLogDto) {
        return this.auditService.createAuditLog(createAuditLogDto);
    }
    async listReports(query) {
        return this.reportService.listReports(query);
    }
    async getReportById(id) {
        return this.reportService.getReportById(id);
    }
    async createReport(dto, req) {
        const userId = req.user?.id || 'system';
        const userRole = req.user?.role || models_1.UserRole.ADMIN;
        const context = (0, execution_context_interface_1.createExecutionContext)(userId, userRole, {
            ip: req.ip,
            headers: { 'user-agent': req.headers['user-agent'] },
        });
        return this.reportService.createReport(dto, userId, context);
    }
    async updateReport(id, dto, req) {
        const userId = req.user?.id || 'system';
        const userRole = req.user?.role || models_1.UserRole.ADMIN;
        const context = (0, execution_context_interface_1.createExecutionContext)(userId, userRole, {
            ip: req.ip,
            headers: { 'user-agent': req.headers['user-agent'] },
        });
        return this.reportService.updateReport(id, dto, context);
    }
    async deleteReport(id, req) {
        const userId = req.user?.id || 'system';
        const userRole = req.user?.role || models_1.UserRole.ADMIN;
        const context = (0, execution_context_interface_1.createExecutionContext)(userId, userRole, {
            ip: req.ip,
            headers: { 'user-agent': req.headers['user-agent'] },
        });
        await this.reportService.deleteReport(id, context);
        return { deleted: true };
    }
    async generateReport(dto, req) {
        const userId = req.user?.id || 'system';
        const userRole = req.user?.role || models_1.UserRole.ADMIN;
        const context = (0, execution_context_interface_1.createExecutionContext)(userId, userRole, {
            ip: req.ip,
            headers: { 'user-agent': req.headers['user-agent'] },
        });
        return this.reportService.generateReport(dto, userId, context);
    }
    async listChecklists(query) {
        return this.checklistService.listChecklists(query);
    }
    async getChecklistById(id) {
        return this.checklistService.getChecklistById(id);
    }
    async createChecklist(dto) {
        return this.checklistService.createChecklist(dto);
    }
    async updateChecklist(id, dto) {
        return this.checklistService.updateChecklist(id, dto);
    }
    async deleteChecklist(id) {
        await this.checklistService.deleteChecklist(id);
        return { deleted: true };
    }
    async listPolicies(query) {
        return this.policyService.listPolicies(query);
    }
    async getPolicyById(id) {
        return this.policyService.getPolicyById(id);
    }
    async createPolicy(dto) {
        return this.policyService.createPolicy(dto);
    }
    async updatePolicy(id, dto) {
        return this.policyService.updatePolicy(id, dto);
    }
    async deletePolicy(id) {
        await this.policyService.deletePolicy(id);
        return { deleted: true };
    }
    async acknowledgePolicy(id, req) {
        const userId = req.user?.id || 'system';
        const ipAddress = req.ip || 'unknown';
        return this.policyService.acknowledgePolicy(id, userId, ipAddress);
    }
    async getConsentForms(isActive) {
        const filters = {};
        if (isActive !== undefined) {
            filters.isActive = isActive === 'true';
        }
        return this.consentService.getConsentForms(filters);
    }
    async getConsentFormById(id) {
        return this.consentService.getConsentFormById(id);
    }
    async signConsentForm(signConsentFormDto) {
        return this.consentService.signConsentForm(signConsentFormDto);
    }
    async getStudentConsents(studentId) {
        return this.consentService.getStudentConsents(studentId);
    }
    async withdrawConsent(id, withdrawnBy) {
        return this.consentService.withdrawConsent(id, withdrawnBy);
    }
    async listDataRetentionPolicies(query) {
        return this.dataRetentionService.listPolicies(query);
    }
    async getDataRetentionPolicyById(id) {
        return this.dataRetentionService.getPolicyById(id);
    }
    async createDataRetentionPolicy(dto) {
        return this.dataRetentionService.createPolicy(dto);
    }
    async updateDataRetentionPolicy(id, dto, req) {
        const reviewedBy = req.user?.id || 'system';
        return this.dataRetentionService.updatePolicy(id, dto, reviewedBy);
    }
    async getHipaaStatus() {
        return this.statisticsService.getHipaaStatus();
    }
    async getFerpaStatus() {
        return this.statisticsService.getFerpaStatus();
    }
    async listViolations(query) {
        return this.violationService.listViolations(query);
    }
    async createViolation(dto, req) {
        const reportedBy = req.user?.id || 'system';
        return this.violationService.createViolation(dto, reportedBy);
    }
    async updateViolation(id, dto) {
        return this.violationService.updateViolation(id, dto);
    }
    async createRemediation(dto) {
        return this.violationService.createRemediation(dto);
    }
    async updateRemediation(id, dto) {
        return this.violationService.updateRemediation(id, dto);
    }
    async getStatistics(query) {
        return this.statisticsService.getComplianceStatistics(query);
    }
    async getComplianceDashboard() {
        return this.statisticsService.getComplianceDashboard();
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get audit logs with filtering',
        description: 'Retrieve paginated audit logs for HIPAA compliance tracking. Supports filtering by user, entity type, action, and date range.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 50 }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'action', required: false, type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audit logs retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('entityType')),
    __param(4, (0, common_1.Query)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('audit-logs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit log by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Audit log UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit log retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Audit log not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/audit-log.model").AuditLog }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getAuditLogById", null);
__decorate([
    (0, common_1.Post)('audit-logs'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create audit log entry',
        description: 'Create HIPAA-compliant audit log entry',
    }),
    (0, swagger_1.ApiBody)({ type: create_audit_log_dto_1.CreateAuditLogDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Audit log created successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_audit_log_dto_1.CreateAuditLogDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({
        summary: 'List compliance reports',
        description: 'Retrieve paginated compliance reports with filtering',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reports retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_report_dto_1.QueryComplianceReportDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "listReports", null);
__decorate([
    (0, common_1.Get)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get compliance report by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/compliance-report.model").ComplianceReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getReportById", null);
__decorate([
    (0, common_1.Post)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Create compliance report' }),
    (0, swagger_1.ApiBody)({ type: compliance_report_dto_1.CreateComplianceReportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/compliance-report.model").ComplianceReport }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_report_dto_1.CreateComplianceReportDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createReport", null);
__decorate([
    (0, common_1.Put)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update compliance report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: compliance_report_dto_1.UpdateComplianceReportDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report updated successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, compliance_report_dto_1.UpdateComplianceReportDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Delete)('reports/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete compliance report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Report deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deleteReport", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate automated compliance report' }),
    (0, swagger_1.ApiBody)({ type: compliance_report_dto_1.ComplianceGenerateReportDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Report generated successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/compliance-report.model").ComplianceReport }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [compliance_report_dto_1.ComplianceGenerateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Get)('checklists'),
    (0, swagger_1.ApiOperation)({ summary: 'List compliance checklists' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Checklists retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checklist_dto_1.QueryChecklistDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "listChecklists", null);
__decorate([
    (0, common_1.Get)('checklists/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get checklist by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checklist retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/compliance-checklist-item.model").ComplianceChecklistItem }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getChecklistById", null);
__decorate([
    (0, common_1.Post)('checklists'),
    (0, swagger_1.ApiOperation)({ summary: 'Create compliance checklist item' }),
    (0, swagger_1.ApiBody)({ type: checklist_dto_1.CreateChecklistDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Checklist created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/compliance-checklist-item.model").ComplianceChecklistItem }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checklist_dto_1.CreateChecklistDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createChecklist", null);
__decorate([
    (0, common_1.Put)('checklists/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update checklist item' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: checklist_dto_1.UpdateChecklistDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checklist updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/compliance-checklist-item.model").ComplianceChecklistItem }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, checklist_dto_1.UpdateChecklistDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateChecklist", null);
__decorate([
    (0, common_1.Delete)('checklists/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete checklist item' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Checklist deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deleteChecklist", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, swagger_1.ApiOperation)({ summary: 'List policy documents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policies retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/policy-document.model").PolicyDocument] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [policy_dto_1.QueryPolicyDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "listPolicies", null);
__decorate([
    (0, common_1.Get)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get policy by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/policy-document.model").PolicyDocument }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getPolicyById", null);
__decorate([
    (0, common_1.Post)('policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create policy document' }),
    (0, swagger_1.ApiBody)({ type: policy_dto_1.CreatePolicyDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/policy-document.model").PolicyDocument }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [policy_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Put)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update policy document' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: policy_dto_1.UpdatePolicyDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/policy-document.model").PolicyDocument }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, policy_dto_1.UpdatePolicyDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updatePolicy", null);
__decorate([
    (0, common_1.Delete)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete policy document' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Policy deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deletePolicy", null);
__decorate([
    (0, common_1.Post)('policies/:id/acknowledge'),
    (0, swagger_1.ApiOperation)({
        summary: 'Acknowledge policy',
        description: 'COMPLIANCE REQUIRED - Records staff acknowledgment of policy',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy acknowledged successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/policy-acknowledgment.model").PolicyAcknowledgment }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "acknowledgePolicy", null);
__decorate([
    (0, common_1.Get)('consents'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get consent forms',
        description: 'Retrieve consent forms with optional filtering by active status',
    }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Consent forms retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/consent-form.model").ConsentForm] }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getConsentForms", null);
__decorate([
    (0, common_1.Get)('consents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consent form by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Consent form retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/consent-form.model").ConsentForm }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getConsentFormById", null);
__decorate([
    (0, common_1.Post)('consents/sign'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sign consent form',
        description: 'Digitally sign a consent form with legal validity',
    }),
    (0, swagger_1.ApiBody)({ type: sign_consent_form_dto_1.SignConsentFormDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Consent form signed successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/consent-signature.model").ConsentSignature }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_consent_form_dto_1.SignConsentFormDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "signConsentForm", null);
__decorate([
    (0, common_1.Get)('consents/students/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all consents for a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: String }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student consents retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/consent-signature.model").ConsentSignature] }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getStudentConsents", null);
__decorate([
    (0, common_1.Post)('consents/:id/withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw consent' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent withdrawn successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/consent-signature.model").ConsentSignature }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('withdrawnBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "withdrawConsent", null);
__decorate([
    (0, common_1.Get)('data-retention'),
    (0, swagger_1.ApiOperation)({ summary: 'List data retention policies' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Data retention policies retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200, type: [require("../database/models/data-retention-policy.model").DataRetentionPolicy] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_retention_dto_1.QueryDataRetentionDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "listDataRetentionPolicies", null);
__decorate([
    (0, common_1.Get)('data-retention/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get data retention policy by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/data-retention-policy.model").DataRetentionPolicy }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getDataRetentionPolicyById", null);
__decorate([
    (0, common_1.Post)('data-retention'),
    (0, swagger_1.ApiOperation)({ summary: 'Create data retention policy' }),
    (0, swagger_1.ApiBody)({ type: data_retention_dto_1.CreateDataRetentionDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Policy created successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/data-retention-policy.model").DataRetentionPolicy }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_retention_dto_1.CreateDataRetentionDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createDataRetentionPolicy", null);
__decorate([
    (0, common_1.Put)('data-retention/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update data retention policy' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: data_retention_dto_1.UpdateDataRetentionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Policy updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/data-retention-policy.model").DataRetentionPolicy }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, data_retention_dto_1.UpdateDataRetentionDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateDataRetentionPolicy", null);
__decorate([
    (0, common_1.Get)('hipaa-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HIPAA compliance status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'HIPAA status retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getHipaaStatus", null);
__decorate([
    (0, common_1.Get)('ferpa-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FERPA compliance status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'FERPA status retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getFerpaStatus", null);
__decorate([
    (0, common_1.Get)('violations'),
    (0, swagger_1.ApiOperation)({ summary: 'List compliance violations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Violations retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [violation_dto_1.QueryViolationDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "listViolations", null);
__decorate([
    (0, common_1.Post)('violations'),
    (0, swagger_1.ApiOperation)({ summary: 'Report compliance violation' }),
    (0, swagger_1.ApiBody)({ type: violation_dto_1.CreateViolationDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Violation reported successfully' }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/compliance-violation.model").ComplianceViolation }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [violation_dto_1.CreateViolationDto, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createViolation", null);
__decorate([
    (0, common_1.Put)('violations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update violation status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: violation_dto_1.UpdateViolationDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Violation updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/compliance-violation.model").ComplianceViolation }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, violation_dto_1.UpdateViolationDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateViolation", null);
__decorate([
    (0, common_1.Post)('remediation'),
    (0, swagger_1.ApiOperation)({ summary: 'Track remediation action' }),
    (0, swagger_1.ApiBody)({ type: violation_dto_1.CreateRemediationDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Remediation action created successfully',
    }),
    openapi.ApiResponse({ status: 201, type: require("../database/models/remediation-action.model").RemediationAction }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [violation_dto_1.CreateRemediationDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createRemediation", null);
__decorate([
    (0, common_1.Put)('remediation/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update remediation action' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: violation_dto_1.UpdateRemediationDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Remediation updated successfully' }),
    openapi.ApiResponse({ status: 200, type: require("../database/models/remediation-action.model").RemediationAction }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, violation_dto_1.UpdateRemediationDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateRemediation", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get compliance statistics',
        description: 'Comprehensive compliance metrics for dashboards and reporting',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [statistics_dto_1.QueryStatisticsDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get compliance dashboard data',
        description: 'Aggregate compliance dashboard with reports, checklists, consents, and audit statistics',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Dashboard data retrieved successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getComplianceDashboard", null);
exports.ComplianceController = ComplianceController = ComplianceController_1 = __decorate([
    (0, swagger_1.ApiTags)('compliance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('compliance'),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        consent_service_1.ConsentService,
        compliance_report_service_1.ComplianceReportService,
        checklist_service_1.ChecklistService,
        policy_service_1.PolicyService,
        data_retention_service_1.DataRetentionService,
        violation_service_1.ViolationService,
        statistics_service_1.StatisticsService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map