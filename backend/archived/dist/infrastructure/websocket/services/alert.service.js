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
exports.AlertService = void 0;
const common_1 = require("@nestjs/common");
const broadcast_service_1 = require("./broadcast.service");
const base_1 = require("../../../common/base");
let AlertService = class AlertService extends base_1.BaseService {
    broadcastService;
    constructor(broadcastService) {
        super("AlertService");
        this.broadcastService = broadcastService;
    }
    async broadcastEmergencyAlert(organizationId, alert) {
        try {
            const alertData = {
                ...alert,
                priority: 'CRITICAL',
                timestamp: alert.timestamp || new Date().toISOString(),
            };
            await this.broadcastService.broadcastToOrganization(organizationId, 'emergency:alert', alertData);
            this.logInfo(`Emergency alert broadcasted to organization ${organizationId}`, {
                alertId: alert.id,
                severity: alert.severity,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast emergency alert to organization ${organizationId}`, error);
            throw error;
        }
    }
    async broadcastStudentHealthAlert(organizationId, alert) {
        try {
            const alertData = {
                ...alert,
                timestamp: alert.timestamp || new Date().toISOString(),
            };
            await this.broadcastService.broadcastToOrganization(organizationId, 'student:health:alert', alertData);
            this.logInfo(`Student health alert broadcasted to organization ${organizationId}`, {
                studentId: alert.studentId,
                alertType: alert.type,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast student health alert to organization ${organizationId}`, error);
            throw error;
        }
    }
    async broadcastMedicationReminder(organizationId, reminder) {
        try {
            const reminderData = {
                ...reminder,
                timestamp: new Date().toISOString(),
            };
            await this.broadcastService.broadcastToOrganization(organizationId, 'medication:reminder', reminderData);
            this.logInfo(`Medication reminder broadcasted to organization ${organizationId}`, {
                medicationId: reminder.medicationId,
                studentId: reminder.studentId,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast medication reminder to organization ${organizationId}`, error);
            throw error;
        }
    }
    async sendUserNotification(userId, notification) {
        try {
            const notificationData = {
                ...notification,
                timestamp: new Date().toISOString(),
            };
            await this.broadcastService.broadcastToUser(userId, 'health:notification', notificationData);
            this.logInfo(`Notification sent to user ${userId}`, {
                notificationId: notification.id,
                type: notification.type,
            });
        }
        catch (error) {
            this.logError(`Failed to send notification to user ${userId}`, error);
            throw error;
        }
    }
    async broadcastToSchool(schoolId, alert) {
        try {
            const alertData = {
                ...alert,
                timestamp: alert.timestamp || new Date().toISOString(),
            };
            await this.broadcastService.broadcastToSchool(schoolId, 'school:alert', alertData);
            this.logDebug(`Alert broadcasted to school ${schoolId}`, {
                alertId: alert.id,
                severity: alert.severity,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast alert to school ${schoolId}`, error);
            throw error;
        }
    }
    async broadcastToStudent(studentId, alert) {
        try {
            const alertData = {
                ...alert,
                timestamp: alert.timestamp || new Date().toISOString(),
            };
            await this.broadcastService.broadcastToStudent(studentId, 'student:alert', alertData);
            this.logDebug(`Alert broadcasted to student ${studentId}`, {
                alertId: alert.id,
                severity: alert.severity,
            });
        }
        catch (error) {
            this.logError(`Failed to broadcast alert to student ${studentId}`, error);
            throw error;
        }
    }
};
exports.AlertService = AlertService;
exports.AlertService = AlertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService])
], AlertService);
//# sourceMappingURL=alert.service.js.map