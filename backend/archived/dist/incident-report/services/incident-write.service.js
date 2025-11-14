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
exports.IncidentWriteService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const uuid_1 = require("uuid");
const database_1 = require("../../database");
const incident_notification_service_1 = require("./incident-notification.service");
const incident_validation_service_1 = require("./incident-validation.service");
const base_1 = require("../../common/base");
let IncidentWriteService = class IncidentWriteService extends base_1.BaseService {
    incidentReportModel;
    validationService;
    notificationService;
    eventEmitter;
    constructor(incidentReportModel, validationService, notificationService, eventEmitter) {
        super('IncidentWriteService');
        this.incidentReportModel = incidentReportModel;
        this.validationService = validationService;
        this.notificationService = notificationService;
        this.eventEmitter = eventEmitter;
    }
    async createIncidentReport(dto) {
        this.logInfo(`Creating incident report for student: ${dto.studentId}`);
        await this.validationService.validateIncidentReport(dto);
        const incident = await this.incidentReportModel.create({
            id: (0, uuid_1.v4)(),
            studentId: dto.studentId,
            reportedById: dto.reportedById,
            occurredAt: dto.occurredAt,
            type: dto.type,
            severity: dto.severity,
            location: dto.location,
            description: dto.description,
            witnesses: dto.witnesses || [],
            actionsTaken: dto.actionsTaken || [],
            followUpRequired: dto.followUpRequired || false,
            parentNotified: false,
            complianceStatus: 'pending',
            insuranceClaimStatus: 'not_required',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.notificationService.notifyEmergencyContacts(incident);
        await this.notificationService.notifyParent(incident);
        this.eventEmitter.emit('incident.created', incident);
        return incident;
    }
    async updateIncidentReport(id, dto) {
        this.logInfo(`Updating incident report: ${id}`);
        const incident = await this.incidentReportModel.findByPk(id);
        if (!incident) {
            throw new common_1.NotFoundException(`Incident report with ID ${id} not found`);
        }
        await this.validationService.validateIncidentUpdate(dto);
        const updatedIncident = await incident.update({
            ...dto,
            updatedAt: new Date(),
        });
        this.eventEmitter.emit('incident.updated', updatedIncident);
        return updatedIncident;
    }
};
exports.IncidentWriteService = IncidentWriteService;
exports.IncidentWriteService = IncidentWriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __metadata("design:paramtypes", [Object, incident_validation_service_1.IncidentValidationService,
        incident_notification_service_1.IncidentNotificationService,
        event_emitter_1.EventEmitter2])
], IncidentWriteService);
//# sourceMappingURL=incident-write.service.js.map