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
exports.SecurityIncidentService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const incident_status_enum_1 = require("../enums/incident-status.enum");
const ip_restriction_type_enum_1 = require("../enums/ip-restriction-type.enum");
const base_1 = require("../../../common/base");
let SecurityIncidentService = class SecurityIncidentService extends base_1.BaseService {
    incidentModel;
    ipRestrictionModel;
    constructor(incidentModel, ipRestrictionModel) {
        super("SecurityIncidentService");
        this.incidentModel = incidentModel;
        this.ipRestrictionModel = ipRestrictionModel;
    }
    get incidentRepo() {
        return this.incidentModel;
    }
    get ipRestrictionRepo() {
        return this.ipRestrictionModel;
    }
    async reportIncident(dto) {
        try {
            const incident = await this.incidentModel.create({
                ...dto,
                status: incident_status_enum_1.IncidentStatus.DETECTED,
            });
            this.logError('Security incident reported', {
                incidentId: incident.id,
                type: incident.type,
                severity: incident.severity,
            });
            await this.autoRespond(incident);
            return incident;
        }
        catch (error) {
            this.logError('Error reporting security incident', { error });
            throw error;
        }
    }
    async autoRespond(incident) {
        const actionsTaken = [];
        const notificationsSent = [];
        const systemChanges = [];
        try {
            switch (incident.severity) {
                case incident_severity_enum_1.IncidentSeverity.CRITICAL:
                    if (incident.ipAddress) {
                        await this.addTemporaryBlacklist(incident.ipAddress, incident.id);
                        actionsTaken.push('IP address added to blacklist');
                        systemChanges.push('IP restriction added');
                    }
                    await this.notifySecurityTeam(incident, 'URGENT');
                    notificationsSent.push('Security team alerted (URGENT)');
                    break;
                case incident_severity_enum_1.IncidentSeverity.HIGH:
                    if (incident.ipAddress) {
                        actionsTaken.push('IP address flagged for monitoring');
                    }
                    await this.notifySecurityTeam(incident, 'HIGH');
                    notificationsSent.push('Security team alerted');
                    break;
                case incident_severity_enum_1.IncidentSeverity.MEDIUM:
                    actionsTaken.push('Incident logged for monitoring');
                    const patternDetected = await this.checkIncidentPattern(incident);
                    if (patternDetected) {
                        await this.notifySecurityTeam(incident, 'PATTERN_DETECTED');
                        notificationsSent.push('Security team alerted (pattern detected)');
                    }
                    break;
                case incident_severity_enum_1.IncidentSeverity.LOW:
                    actionsTaken.push('Incident logged');
                    break;
            }
            this.logInfo('Auto-response executed', {
                incidentId: incident.id,
                actionsTaken,
                notificationsSent,
                systemChanges,
            });
            return {
                incident,
                actionsTaken,
                notificationsSent,
                systemChanges,
            };
        }
        catch (error) {
            this.logError('Error in auto-response', {
                error,
                incidentId: incident.id,
            });
            return {
                incident,
                actionsTaken: ['Error during auto-response'],
                notificationsSent: [],
                systemChanges: [],
            };
        }
    }
    async addTemporaryBlacklist(ipAddress, incidentId) {
        try {
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            const restriction = await this.ipRestrictionModel.create({
                type: ip_restriction_type_enum_1.IpRestrictionType.BLACKLIST,
                ipAddress,
                reason: `Automatic blacklist due to security incident ${incidentId}`,
                createdBy: 'system',
                expiresAt,
                isActive: true,
            });
            this.logWarning('Temporary IP blacklist added', {
                ipAddress,
                incidentId,
                expiresAt,
            });
        }
        catch (error) {
            this.logError('Error adding temporary blacklist', {
                error,
                ipAddress,
            });
        }
    }
    async notifySecurityTeam(incident, urgency) {
        try {
            this.logWarning('Security team notified', {
                incidentId: incident.id,
                urgency,
                type: incident.type,
                severity: incident.severity,
            });
        }
        catch (error) {
            this.logError('Error notifying security team', { error });
        }
    }
    async checkIncidentPattern(incident) {
        try {
            const oneHourAgo = new Date(Date.now() - 3600000);
            const similarIncidents = await this.incidentModel.count({
                where: {
                    type: incident.type,
                    detectedAt: {
                        [sequelize_2.Op.between]: [oneHourAgo, new Date()],
                    },
                },
            });
            return similarIncidents > 3;
        }
        catch (error) {
            this.logError('Error checking incident pattern', { error });
            return false;
        }
    }
    async getAllIncidents(filters) {
        try {
            const where = {};
            if (filters) {
                if (filters.type)
                    where.type = filters.type;
                if (filters.severity)
                    where.severity = filters.severity;
                if (filters.status)
                    where.status = filters.status;
                if (filters.userId)
                    where.userId = filters.userId;
                if (filters.startDate && filters.endDate) {
                    where.detectedAt = {
                        [sequelize_2.Op.between]: [new Date(filters.startDate), new Date(filters.endDate)],
                    };
                }
            }
            return await this.incidentModel.findAll({
                where,
                order: [['detectedAt', 'DESC']],
                limit: 100,
            });
        }
        catch (error) {
            this.logError('Error fetching incidents', { error });
            return [];
        }
    }
    async getIncidentById(id) {
        try {
            return await this.incidentModel.findByPk(id);
        }
        catch (error) {
            this.logError('Error fetching incident', { error, id });
            return null;
        }
    }
    async updateIncidentStatus(incidentId, dto) {
        try {
            const incident = await this.incidentModel.findByPk(incidentId);
            if (!incident) {
                this.logWarning('Incident not found', { incidentId });
                return null;
            }
            Object.assign(incident, dto);
            if (dto.status === incident_status_enum_1.IncidentStatus.RESOLVED && !incident.resolvedAt) {
                incident.resolvedAt = new Date();
            }
            await incident.save();
            this.logInfo('Incident status updated', {
                incidentId,
                status: dto.status,
                hasResolution: !!dto.resolution,
            });
            return incident;
        }
        catch (error) {
            this.logError('Error updating incident status', {
                error,
                incidentId,
            });
            return null;
        }
    }
    async generateIncidentReport(startDate, endDate) {
        try {
            const incidents = await this.incidentModel.findAll({
                where: {
                    detectedAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                },
            });
            const byType = {};
            const bySeverity = {};
            const byStatus = {};
            incidents.forEach((incident) => {
                byType[incident.type] = (byType[incident.type] || 0) + 1;
                bySeverity[incident.severity] = (bySeverity[incident.severity] || 0) + 1;
                byStatus[incident.status] = (byStatus[incident.status] || 0) + 1;
            });
            const criticalIncidents = incidents.filter((i) => i.severity === incident_severity_enum_1.IncidentSeverity.CRITICAL);
            this.logInfo('Incident report generated', {
                startDate,
                endDate,
                totalIncidents: incidents.length,
            });
            return {
                totalIncidents: incidents.length,
                byType,
                bySeverity,
                byStatus,
                criticalIncidents,
            };
        }
        catch (error) {
            this.logError('Error generating incident report', { error });
            throw error;
        }
    }
    async getIncidentStatistics() {
        try {
            const now = new Date();
            const day24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const days7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const [last24Hours, last7Days, last30Days, criticalUnresolved, highUnresolved] = await Promise.all([
                this.incidentModel.count({
                    where: { detectedAt: { [sequelize_2.Op.between]: [day24Ago, now] } },
                }),
                this.incidentModel.count({
                    where: { detectedAt: { [sequelize_2.Op.between]: [days7Ago, now] } },
                }),
                this.incidentModel.count({
                    where: { detectedAt: { [sequelize_2.Op.between]: [days30Ago, now] } },
                }),
                this.incidentModel.count({
                    where: {
                        severity: incident_severity_enum_1.IncidentSeverity.CRITICAL,
                        status: incident_status_enum_1.IncidentStatus.DETECTED,
                    },
                }),
                this.incidentModel.count({
                    where: {
                        severity: incident_severity_enum_1.IncidentSeverity.HIGH,
                        status: incident_status_enum_1.IncidentStatus.DETECTED,
                    },
                }),
            ]);
            return {
                last24Hours,
                last7Days,
                last30Days,
                criticalUnresolved,
                highUnresolved,
            };
        }
        catch (error) {
            this.logError('Error getting incident statistics', { error });
            throw error;
        }
    }
};
exports.SecurityIncidentService = SecurityIncidentService;
exports.SecurityIncidentService = SecurityIncidentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.SecurityIncident)),
    __param(1, (0, sequelize_1.InjectModel)(models_1.IpRestriction)),
    __metadata("design:paramtypes", [Object, Object])
], SecurityIncidentService);
//# sourceMappingURL=security-incident.service.js.map