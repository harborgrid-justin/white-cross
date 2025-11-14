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
exports.SecurityController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const services_1 = require("./services");
const security_incident_dto_1 = require("./dto/security-incident.dto");
const security_incident_dto_2 = require("./dto/security-incident.dto");
const security_incident_dto_3 = require("./dto/security-incident.dto");
const ip_restriction_dto_1 = require("./dto/ip-restriction.dto");
const ip_restriction_dto_2 = require("./dto/ip-restriction.dto");
const ip_restriction_dto_3 = require("./dto/ip-restriction.dto");
const base_1 = require("../../common/base");
let SecurityController = class SecurityController extends base_1.BaseController {
    ipRestrictionService;
    incidentService;
    sessionService;
    threatDetectionService;
    constructor(ipRestrictionService, incidentService, sessionService, threatDetectionService) {
        super();
        this.ipRestrictionService = ipRestrictionService;
        this.incidentService = incidentService;
        this.sessionService = sessionService;
        this.threatDetectionService = threatDetectionService;
    }
    async createIpRestriction(dto) {
        if (dto.type === 'whitelist') {
            return await this.ipRestrictionService.addToWhitelist(dto);
        }
        else if (dto.type === 'blacklist') {
            return await this.ipRestrictionService.addToBlacklist(dto);
        }
        return await this.ipRestrictionService.addToWhitelist(dto);
    }
    async listIpRestrictions(type) {
        return await this.ipRestrictionService.getAllRestrictions(type);
    }
    async updateIpRestriction(id, dto) {
        return await this.ipRestrictionService.updateRestriction(id, dto);
    }
    async removeIpRestriction(id) {
        const result = await this.ipRestrictionService.removeRestriction(id);
        return { success: result };
    }
    async checkIpAccess(dto) {
        return await this.ipRestrictionService.checkIPAccess(dto.ipAddress, dto.userId);
    }
    async reportIncident(dto) {
        return await this.incidentService.reportIncident(dto);
    }
    async listIncidents(filters) {
        return await this.incidentService.getAllIncidents(filters);
    }
    async getIncidentStatistics() {
        return await this.incidentService.getIncidentStatistics();
    }
    async getIncident(id) {
        const incident = await this.incidentService.getIncidentById(id);
        if (!incident) {
            return { error: 'Incident not found' };
        }
        return incident;
    }
    async updateIncidentStatus(id, dto) {
        return await this.incidentService.updateIncidentStatus(id, dto);
    }
    async generateIncidentReport(startDate, endDate) {
        return await this.incidentService.generateIncidentReport(new Date(startDate), new Date(endDate));
    }
    async listActiveSessions(userId) {
        return await this.sessionService.getActiveSessions(userId);
    }
    async invalidateSession(id) {
        const result = await this.sessionService.invalidateSession(id);
        return { success: result };
    }
    async invalidateUserSessions(userId) {
        const count = await this.sessionService.invalidateUserSessions(userId);
        return { invalidatedCount: count };
    }
    async cleanupExpiredSessions() {
        const count = await this.sessionService.cleanupExpiredSessions();
        return { cleanedCount: count };
    }
    async getThreatDetectionStatus() {
        return {
            enabled: true,
            detectionMethods: [
                'sql_injection',
                'xss',
                'brute_force',
                'privilege_escalation',
                'data_breach',
                'path_traversal',
                'command_injection',
            ],
            bruteForceThreshold: 5,
            bruteForceWindowSeconds: 300,
        };
    }
    async getRecentFailedAttempts(ipAddress) {
        return await this.threatDetectionService.getRecentFailedAttempts(ipAddress);
    }
    async scanInput(body) {
        return await this.threatDetectionService.scanInput(body.input, {
            userId: body.userId,
            ipAddress: body.ipAddress,
        });
    }
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date(),
            modules: {
                ipRestriction: 'operational',
                threatDetection: 'operational',
                incidentManagement: 'operational',
                sessionManagement: 'operational',
            },
        };
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Post)('ip-restrictions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create IP restriction rule',
        description: 'Creates a new IP restriction rule for whitelist, blacklist, or geo-restriction. Supports individual IPs, CIDR notation, or geographic regions.',
    }),
    (0, swagger_1.ApiBody)({ type: ip_restriction_dto_2.SecurityCreateIpRestrictionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'IP restriction created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                type: {
                    type: 'string',
                    enum: ['whitelist', 'blacklist', 'geo_restriction'],
                },
                ipAddress: { type: 'string' },
                description: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid IP address format or restriction data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ip_restriction_dto_2.SecurityCreateIpRestrictionDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "createIpRestriction", null);
__decorate([
    (0, common_1.Get)('ip-restrictions'),
    (0, swagger_1.ApiOperation)({
        summary: 'List all IP restrictions',
        description: 'Retrieves all IP restriction rules with optional filtering by type (whitelist, blacklist, geo_restriction).',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['whitelist', 'blacklist', 'geo_restriction'],
        description: 'Filter by restriction type',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of IP restrictions retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    type: {
                        type: 'string',
                        enum: ['whitelist', 'blacklist', 'geo_restriction'],
                    },
                    ipAddress: { type: 'string' },
                    description: { type: 'string' },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "listIpRestrictions", null);
__decorate([
    (0, common_1.Patch)('ip-restrictions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update IP restriction',
        description: 'Updates an existing IP restriction rule. Allows modification of description, active status, and IP address.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'IP restriction UUID' }),
    (0, swagger_1.ApiBody)({ type: ip_restriction_dto_3.UpdateIpRestrictionDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'IP restriction updated successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                type: { type: 'string' },
                ipAddress: { type: 'string' },
                description: { type: 'string' },
                isActive: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'IP restriction not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ip_restriction_dto_3.UpdateIpRestrictionDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateIpRestriction", null);
__decorate([
    (0, common_1.Delete)('ip-restrictions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove IP restriction',
        description: 'Permanently removes an IP restriction rule from the system. This action cannot be undone.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'IP restriction UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'IP restriction removed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: {
                    type: 'string',
                    example: 'IP restriction removed successfully',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin role required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'IP restriction not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "removeIpRestriction", null);
__decorate([
    (0, common_1.Post)('ip-restrictions/check'),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if IP address is allowed',
        description: 'Validates if a specific IP address is allowed based on current restriction rules. Used for real-time access control validation.',
    }),
    (0, swagger_1.ApiBody)({ type: ip_restriction_dto_1.IpCheckDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'IP access check completed successfully',
        schema: {
            type: 'object',
            properties: {
                isAllowed: { type: 'boolean' },
                reason: { type: 'string' },
                restrictionType: { type: 'string', nullable: true },
                ipAddress: { type: 'string' },
                checkDate: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid IP address format' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ip_restriction_dto_1.IpCheckDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "checkIpAccess", null);
__decorate([
    (0, common_1.Post)('incidents'),
    (0, swagger_1.ApiOperation)({
        summary: 'Report security incident',
        description: 'Reports a new security incident with detailed information including type, severity, affected resources, and initial assessment. Triggers automated response workflows.',
    }),
    (0, swagger_1.ApiBody)({ type: security_incident_dto_2.SecurityCreateIncidentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Security incident reported successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                incidentNumber: { type: 'string' },
                type: { type: 'string' },
                severity: {
                    type: 'string',
                    enum: ['low', 'medium', 'high', 'critical'],
                },
                status: {
                    type: 'string',
                    enum: ['open', 'investigating', 'resolved', 'closed'],
                },
                reportedAt: { type: 'string', format: 'date-time' },
                reportedBy: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid incident data or missing required fields',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_incident_dto_2.SecurityCreateIncidentDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "reportIncident", null);
__decorate([
    (0, common_1.Get)('incidents'),
    (0, swagger_1.ApiOperation)({
        summary: 'List security incidents with filters',
        description: 'Retrieves paginated list of security incidents with filtering by status, severity, type, date range, and affected resources.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: ['open', 'investigating', 'resolved', 'closed'],
        description: 'Filter by incident status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'severity',
        required: false,
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Filter by severity level',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by incident type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Security incidents retrieved successfully with pagination',
        schema: {
            type: 'object',
            properties: {
                incidents: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            incidentNumber: { type: 'string' },
                            type: { type: 'string' },
                            severity: { type: 'string' },
                            status: { type: 'string' },
                            title: { type: 'string' },
                            reportedAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_incident_dto_1.IncidentFilterDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "listIncidents", null);
__decorate([
    (0, common_1.Get)('incidents/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident statistics' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getIncidentStatistics", null);
__decorate([
    (0, common_1.Get)('incidents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get incident by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getIncident", null);
__decorate([
    (0, common_1.Patch)('incidents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update incident status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident updated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, security_incident_dto_3.UpdateIncidentStatusDto]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateIncidentStatus", null);
__decorate([
    (0, common_1.Get)('incidents/report/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate incident report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Incident report' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "generateIncidentReport", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'List active sessions for user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active sessions' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "listActiveSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session invalidated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "invalidateSession", null);
__decorate([
    (0, common_1.Delete)('sessions/user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Invalidate all user sessions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User sessions invalidated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "invalidateUserSessions", null);
__decorate([
    (0, common_1.Post)('sessions/cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Cleanup expired sessions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired sessions cleaned' }),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "cleanupExpiredSessions", null);
__decorate([
    (0, common_1.Get)('threats/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get threat detection status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Threat detection status' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getThreatDetectionStatus", null);
__decorate([
    (0, common_1.Get)('threats/recent-attempts/:ipAddress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent failed login attempts for IP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent failed attempts' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('ipAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getRecentFailedAttempts", null);
__decorate([
    (0, common_1.Post)('threats/scan-input'),
    (0, swagger_1.ApiOperation)({ summary: 'Scan input for threats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Threat scan results' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "scanInput", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Security module health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health status' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "healthCheck", null);
exports.SecurityController = SecurityController = __decorate([
    (0, swagger_1.ApiTags)('Security'),
    (0, common_1.Controller)('security'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [services_1.IpRestrictionService,
        services_1.SecurityIncidentService,
        services_1.SessionManagementService,
        services_1.ThreatDetectionService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map