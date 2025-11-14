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
exports.IncidentNotificationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const enums_1 = require("../../services/communication/contact/enums");
const config_1 = require("../../common/config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let IncidentNotificationService = class IncidentNotificationService extends base_1.BaseService {
    incidentReportModel;
    emergencyContactModel;
    config;
    notificationListeners = new Set();
    constructor(logger, incidentReportModel, emergencyContactModel, config) {
        super({
            serviceName: 'IncidentNotificationService',
            logger,
            enableAuditLogging: true,
        });
        this.incidentReportModel = incidentReportModel;
        this.emergencyContactModel = emergencyContactModel;
        this.config = config;
        this.logInfo('IncidentNotificationService initialized');
    }
    onModuleDestroy() {
        this.logInfo('IncidentNotificationService shutting down - cleaning up resources');
        if (this.notificationListeners.size > 0) {
            this.logInfo(`Clearing ${this.notificationListeners.size} notification listeners`);
            this.notificationListeners.clear();
        }
        this.logInfo('IncidentNotificationService destroyed, resources cleaned up');
    }
    async notifyEmergencyContacts(incidentId) {
        try {
            const report = await this.incidentReportModel.findByPk(incidentId);
            if (!report) {
                throw new common_1.NotFoundException('Incident report not found');
            }
            const emergencyContacts = await this.emergencyContactModel.findAll({
                where: {
                    studentId: report.studentId,
                    isActive: true,
                },
                order: [
                    ['priority', 'ASC'],
                    ['createdAt', 'ASC'],
                ],
            });
            if (!emergencyContacts || emergencyContacts.length === 0) {
                this.logWarning(`No emergency contacts found for incident ${incidentId} (Student: ${report.studentId})`);
                return false;
            }
            const message = `Incident Alert: Student was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school for more information.`;
            const notificationResults = [];
            for (const contact of emergencyContacts) {
                const channels = contact.parsedNotificationChannels;
                const preferredMethod = contact.preferredContactMethod || 'ANY';
                let notificationMethod = 'email';
                if (preferredMethod === 'SMS' || channels.includes('sms')) {
                    notificationMethod = 'sms';
                }
                else if (preferredMethod === 'VOICE' || channels.includes('voice')) {
                    notificationMethod = 'voice';
                }
                this.logInfo(`Notification sent to ${contact.fullName} (${contact.relationship}) via ${notificationMethod}: ${contact.phoneNumber || contact.email}`);
                notificationResults.push({
                    contactId: contact.id,
                    contactName: contact.fullName,
                    method: notificationMethod,
                    status: 'sent',
                });
                if (report.severity !== 'CRITICAL' &&
                    report.severity !== 'HIGH' &&
                    contact.priority === enums_1.ContactPriority.PRIMARY) {
                    break;
                }
            }
            await this.markParentNotified(incidentId, 'auto-notification', `system (${notificationResults.length} contacts notified)`);
            this.logInfo(`Emergency contacts notified for incident ${incidentId}: ${notificationResults.length} notifications sent`);
            return true;
        }
        catch (error) {
            this.logError('Error notifying emergency contacts:', error);
            throw error;
        }
    }
    async notifyParent(incidentReportId, method, notifiedBy) {
        try {
            const report = await this.incidentReportModel.findByPk(incidentReportId);
            if (!report) {
                throw new common_1.NotFoundException('Incident report not found');
            }
            const message = `Incident Alert: Student was involved in a ${report.type} incident (${report.severity} severity) on ${report.occurredAt.toLocaleString()}. Please contact the school for more information.`;
            this.logInfo(`Parent notification sent for incident ${incidentReportId} via ${method}: ${message}`);
            const updatedReport = await this.markParentNotified(incidentReportId, method, notifiedBy);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error notifying parent:', error);
            throw error;
        }
    }
    async markParentNotified(id, notificationMethod, notifiedBy) {
        try {
            const report = await this.incidentReportModel.findByPk(id);
            if (!report) {
                throw new common_1.NotFoundException('Incident report not found');
            }
            report.parentNotified = true;
            report.parentNotificationMethod = notificationMethod || 'manual';
            report.parentNotifiedAt = new Date();
            const methodNote = notificationMethod
                ? `Parent notified via ${notificationMethod}${notifiedBy ? ` by ${notifiedBy}` : ''}`
                : 'Parent notified';
            report.followUpNotes = report.followUpNotes
                ? `${report.followUpNotes}\n${methodNote}`
                : methodNote;
            const updatedReport = await report.save();
            this.logInfo(`Parent notification marked for incident ${id}`);
            return updatedReport;
        }
        catch (error) {
            this.logError('Error marking parent as notified:', error);
            throw error;
        }
    }
};
exports.IncidentNotificationService = IncidentNotificationService;
exports.IncidentNotificationService = IncidentNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.IncidentReport)),
    __param(2, (0, sequelize_1.InjectModel)(database_1.EmergencyContact)),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object, Object, config_1.AppConfigService])
], IncidentNotificationService);
//# sourceMappingURL=incident-notification.service.js.map