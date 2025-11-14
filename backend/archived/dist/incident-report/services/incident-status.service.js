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
exports.IncidentStatusService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const incident_notification_service_1 = require("./incident-notification.service");
const base_1 = require("../../common/base");
let IncidentStatusService = class IncidentStatusService extends base_1.BaseService {
    incidentReportModel;
    notificationService;
    constructor(incidentReportModel, notificationService) {
        super('IncidentStatusService');
        this.incidentReportModel = incidentReportModel;
        this.notificationService = notificationService;
    }
    async addFollowUpNotes(id, notes) {
        this.logInfo(`Adding follow-up notes to incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        const updatedNotes = incident.followUpNotes
            ? `${incident.followUpNotes}\n\n${new Date().toISOString()}: ${notes}`
            : `${new Date().toISOString()}: ${notes}`;
        return incident.update({
            followUpNotes: updatedNotes,
            updatedAt: new Date(),
        });
    }
    async markParentNotified(id) {
        this.logInfo(`Marking parent as notified for incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        return incident.update({
            parentNotified: true,
            updatedAt: new Date(),
        });
    }
    async addEvidence(id, evidence) {
        this.logInfo(`Adding evidence to incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        const currentEvidence = incident.evidence || [];
        const updatedEvidence = [...currentEvidence, ...evidence];
        return incident.update({
            evidence: updatedEvidence,
            updatedAt: new Date(),
        });
    }
    async updateInsuranceClaim(id, status, claimNumber) {
        this.logInfo(`Updating insurance claim for incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        const updateData = {
            insuranceClaimStatus: status,
            updatedAt: new Date(),
        };
        if (claimNumber) {
            updateData.insuranceClaimNumber = claimNumber;
        }
        return incident.update(updateData);
    }
    async updateComplianceStatus(id, status, notes) {
        this.logInfo(`Updating compliance status for incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        const updateData = {
            complianceStatus: status,
            updatedAt: new Date(),
        };
        if (notes) {
            updateData.complianceNotes = notes;
        }
        return incident.update(updateData);
    }
    async notifyEmergencyContacts(id) {
        this.logInfo(`Notifying emergency contacts for incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        await this.notificationService.notifyEmergencyContacts(incident);
        return { message: 'Emergency contacts notified successfully' };
    }
    async notifyParent(id, message) {
        this.logInfo(`Notifying parent for incident: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        await this.notificationService.notifyParent(incident, message);
        return { message: 'Parent notified successfully' };
    }
};
exports.IncidentStatusService = IncidentStatusService;
exports.IncidentStatusService = IncidentStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, incident_notification_service_1.IncidentNotificationService])
], IncidentStatusService);
//# sourceMappingURL=incident-status.service.js.map