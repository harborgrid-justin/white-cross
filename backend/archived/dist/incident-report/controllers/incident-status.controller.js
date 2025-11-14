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
exports.IncidentStatusController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const incident_status_service_1 = require("../services/incident-status.service");
const base_1 = require("../../common/base");
let IncidentStatusController = class IncidentStatusController extends base_1.BaseController {
    statusService;
    constructor(statusService) {
        super();
        this.statusService = statusService;
    }
    async addFollowUpNotes(id, notes) {
        return this.statusService.addFollowUpNotes(id, notes);
    }
    async markParentNotified(id) {
        return this.statusService.markParentNotified(id);
    }
    async addEvidence(id, evidence) {
        return this.statusService.addEvidence(id, evidence);
    }
    async updateInsuranceClaim(id, data) {
        return this.statusService.updateInsuranceClaim(id, data.status, data.claimNumber);
    }
    async updateComplianceStatus(id, data) {
        return this.statusService.updateComplianceStatus(id, data.status, data.notes);
    }
    async notifyEmergencyContacts(id) {
        return this.statusService.notifyEmergencyContacts(id);
    }
    async notifyParent(id, message) {
        return this.statusService.notifyParent(id, message);
    }
};
exports.IncidentStatusController = IncidentStatusController;
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add notes to incident report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid', description: 'Incident report ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                notes: { type: 'string', description: 'Notes to add' },
            },
            required: ['notes'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notes added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "addFollowUpNotes", null);
__decorate([
    (0, common_1.Post)(':id/notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Create parent notification for incident' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid', description: 'Incident report ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', enum: ['PARENT', 'GUARDIAN', 'EMERGENCY_CONTACT'], default: 'PARENT' },
                method: { type: 'string', enum: ['EMAIL', 'PHONE', 'SMS', 'IN_PERSON'] },
                notes: { type: 'string', description: 'Additional notification notes' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notification created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "markParentNotified", null);
__decorate([
    (0, common_1.Post)(':id/evidence'),
    (0, swagger_1.ApiOperation)({ summary: 'Add evidence to incident report' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                evidence: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Evidence items to add',
                },
            },
            required: ['evidence'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evidence added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('evidence')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "addEvidence", null);
__decorate([
    (0, common_1.Patch)(':id/insurance-claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance claim status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['not_required', 'pending', 'submitted', 'approved', 'denied'],
                    description: 'Insurance claim status',
                },
                claimNumber: { type: 'string', description: 'Insurance claim number' },
            },
            required: ['status'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insurance claim status updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "updateInsuranceClaim", null);
__decorate([
    (0, common_1.Patch)(':id/compliance'),
    (0, swagger_1.ApiOperation)({ summary: 'Update compliance status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['pending', 'in_progress', 'completed', 'overdue'],
                    description: 'Compliance status',
                },
                notes: { type: 'string', description: 'Compliance notes' },
            },
            required: ['status'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compliance status updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/incident-report.model").IncidentReport }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "updateComplianceStatus", null);
__decorate([
    (0, common_1.Post)(':id/notify-emergency-contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Notify emergency contacts' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergency contacts notified' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "notifyEmergencyContacts", null);
__decorate([
    (0, common_1.Post)(':id/notify-parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Notify parent' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', description: 'Custom notification message' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent notified' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Incident report not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncidentStatusController.prototype, "notifyParent", null);
exports.IncidentStatusController = IncidentStatusController = __decorate([
    (0, swagger_1.ApiTags)('incident-reports-status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('incident-reports'),
    __metadata("design:paramtypes", [incident_status_service_1.IncidentStatusService])
], IncidentStatusController);
//# sourceMappingURL=incident-status.controller.js.map