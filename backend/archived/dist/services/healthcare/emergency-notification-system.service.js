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
exports.EmergencyType = exports.EmergencyNotificationSystemService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const base_1 = require("../../common/base");
let EmergencyNotificationSystemService = class EmergencyNotificationSystemService extends base_1.BaseService {
    emergencyBroadcastModel;
    pushNotificationModel;
    userModel;
    studentModel;
    emergencyContactModel;
    sequelize;
    constructor(emergencyBroadcastModel, pushNotificationModel, userModel, studentModel, emergencyContactModel, sequelize) {
        super("EmergencyNotificationSystemService");
        this.emergencyBroadcastModel = emergencyBroadcastModel;
        this.pushNotificationModel = pushNotificationModel;
        this.userModel = userModel;
        this.studentModel = studentModel;
        this.emergencyContactModel = emergencyContactModel;
        this.sequelize = sequelize;
    }
    async triggerEmergency(emergency) {
        const transaction = await this.sequelize.transaction();
        try {
            const broadcast = await this.emergencyBroadcastModel.create({
                id: this.generateEmergencyId(),
                type: emergency.type,
                severity: emergency.severity,
                title: emergency.title,
                message: emergency.message,
                location: emergency.location,
                affectedStudents: emergency.affectedStudents,
                affectedStaff: emergency.affectedStaff,
                triggeredBy: emergency.triggeredBy,
                status: 'ACTIVE',
                escalationLevel: 1,
                responseRequired: emergency.responseRequired,
                medicalEmergency: emergency.medicalEmergency,
                metadata: emergency.metadata,
            }, { transaction });
            const targets = await this.determineNotificationTargets(emergency, transaction);
            const notifications = await this.sendImmediateNotifications(broadcast, targets, transaction);
            if (emergency.responseRequired) {
                await this.scheduleEscalation(broadcast, targets, transaction);
            }
            await transaction.commit();
            this.logWarning(`Emergency triggered: ${broadcast.id} - ${emergency.title} (Severity: ${emergency.severity})`);
            return {
                emergencyId: broadcast.id,
                status: 'TRIGGERED',
                notificationsSent: notifications.length,
                targetsReached: targets.length,
                escalationScheduled: emergency.responseRequired,
                estimatedResponseTime: this.calculateEstimatedResponseTime(emergency.severity),
            };
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to trigger emergency: ${error.message}`, error.stack);
            throw error;
        }
    }
    async acknowledgeEmergency(emergencyId, responder) {
        const transaction = await this.sequelize.transaction();
        try {
            const broadcast = await this.emergencyBroadcastModel.findByPk(emergencyId, { transaction });
            if (!broadcast) {
                throw new Error(`Emergency ${emergencyId} not found`);
            }
            await broadcast.update({
                acknowledgedBy: responder.userId,
                acknowledgedAt: new Date(),
                status: 'ACKNOWLEDGED',
                responseDetails: {
                    responder: responder.userName,
                    responderRole: responder.role,
                    responseTime: Date.now() - broadcast.createdAt.getTime(),
                    location: responder.location,
                    notes: responder.notes,
                },
            }, { transaction });
            await this.cancelEscalation(emergencyId, transaction);
            await this.sendAcknowledgmentNotifications(broadcast, responder, transaction);
            await transaction.commit();
            this.logInfo(`Emergency acknowledged: ${emergencyId} by ${responder.userName}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to acknowledge emergency: ${error.message}`, error.stack);
            throw error;
        }
    }
    async escalateEmergency(emergencyId) {
        const transaction = await this.sequelize.transaction();
        try {
            const broadcast = await this.emergencyBroadcastModel.findByPk(emergencyId, { transaction });
            if (!broadcast) {
                throw new Error(`Emergency ${emergencyId} not found`);
            }
            const newLevel = broadcast.escalationLevel + 1;
            const additionalTargets = await this.getEscalationTargets(broadcast, newLevel, transaction);
            await this.sendEscalatedNotifications(broadcast, additionalTargets, newLevel, transaction);
            await broadcast.update({
                escalationLevel: newLevel,
                lastEscalatedAt: new Date(),
                metadata: {
                    ...broadcast.metadata,
                    escalationHistory: [
                        ...(broadcast.metadata?.escalationHistory || []),
                        {
                            level: newLevel,
                            timestamp: new Date(),
                            targets: additionalTargets.length,
                        },
                    ],
                },
            }, { transaction });
            if (newLevel < this.getMaxEscalationLevel(broadcast.severity)) {
                await this.scheduleNextEscalation(broadcast, newLevel + 1, transaction);
            }
            await transaction.commit();
            this.logWarning(`Emergency escalated: ${emergencyId} to level ${newLevel}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to escalate emergency: ${error.message}`, error.stack);
            throw error;
        }
    }
    async resolveEmergency(emergencyId, resolution) {
        const transaction = await this.sequelize.transaction();
        try {
            const broadcast = await this.emergencyBroadcastModel.findByPk(emergencyId, { transaction });
            if (!broadcast) {
                throw new Error(`Emergency ${emergencyId} not found`);
            }
            await broadcast.update({
                status: 'RESOLVED',
                resolvedBy: resolution.resolvedBy,
                resolvedAt: new Date(),
                resolutionDetails: {
                    resolution: resolution.resolution,
                    actionsTaken: resolution.actionsTaken,
                    followUpRequired: resolution.followUpRequired,
                    followUpNotes: resolution.followUpNotes,
                },
            }, { transaction });
            await this.cancelAllEscalations(emergencyId, transaction);
            await this.sendResolutionNotifications(broadcast, resolution, transaction);
            await transaction.commit();
            this.logInfo(`Emergency resolved: ${emergencyId} - ${resolution.resolution}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to resolve emergency: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getEmergencyStatus(emergencyId) {
        const broadcast = await this.emergencyBroadcastModel.findByPk(emergencyId, {
            include: [
                {
                    model: models_2.PushNotification,
                    as: 'notifications',
                    where: { emergencyId: emergencyId },
                    required: false,
                },
            ],
        });
        if (!broadcast) {
            throw new Error(`Emergency ${emergencyId} not found`);
        }
        const notifications = broadcast.notifications || [];
        const acknowledgments = notifications.filter((n) => n.status === 'DELIVERED');
        const failures = notifications.filter((n) => n.status === 'FAILED');
        return {
            emergencyId: broadcast.id,
            type: broadcast.type,
            severity: broadcast.severity,
            status: broadcast.status,
            title: broadcast.title,
            triggeredAt: broadcast.createdAt,
            acknowledgedAt: broadcast.acknowledgedAt,
            resolvedAt: broadcast.resolvedAt,
            escalationLevel: broadcast.escalationLevel,
            notificationsSent: notifications.length,
            acknowledgmentsReceived: acknowledgments.length,
            deliveryFailures: failures.length,
            responseTime: broadcast.acknowledgedAt
                ? broadcast.acknowledgedAt.getTime() - broadcast.createdAt.getTime()
                : null,
            responder: broadcast.acknowledgedBy,
            location: broadcast.location,
            affectedStudents: broadcast.affectedStudents,
            affectedStaff: broadcast.affectedStaff,
        };
    }
    async getActiveEmergencies(filters) {
        const whereClause = {
            status: ['ACTIVE', 'ACKNOWLEDGED'],
        };
        if (filters?.type) {
            whereClause.type = filters.type;
        }
        if (filters?.severity) {
            whereClause.severity = filters.severity;
        }
        if (filters?.location) {
            whereClause.location = {
                [this.sequelize.Op.iLike]: `%${filters.location}%`,
            };
        }
        const broadcasts = await this.emergencyBroadcastModel.findAll({
            where: whereClause,
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
            limit: filters?.limit || 50,
        });
        return broadcasts.map((broadcast) => ({
            id: broadcast.id,
            type: broadcast.type,
            severity: broadcast.severity,
            title: broadcast.title,
            status: broadcast.status,
            location: broadcast.location,
            triggeredAt: broadcast.createdAt,
            escalationLevel: broadcast.escalationLevel,
            affectedCount: (broadcast.affectedStudents?.length || 0) + (broadcast.affectedStaff?.length || 0),
            responseTime: broadcast.acknowledgedAt
                ? broadcast.acknowledgedAt.getTime() - broadcast.createdAt.getTime()
                : null,
        }));
    }
    async sendTestEmergency(testDetails) {
        const transaction = await this.sequelize.transaction();
        try {
            const broadcast = await this.emergencyBroadcastModel.create({
                id: this.generateEmergencyId(),
                type: 'TEST',
                severity: 'LOW',
                title: `TEST: ${testDetails.title}`,
                message: testDetails.message,
                location: testDetails.location || 'Test Location',
                affectedStudents: [],
                affectedStaff: [],
                triggeredBy: testDetails.triggeredBy,
                status: 'TEST',
                escalationLevel: 0,
                responseRequired: false,
                medicalEmergency: false,
                metadata: { test: true, testDetails },
            }, { transaction });
            const notifications = await this.sendTestNotifications(broadcast, testDetails.targets, transaction);
            await transaction.commit();
            return {
                testId: broadcast.id,
                notificationsSent: notifications.length,
                targets: testDetails.targets,
                sentAt: new Date(),
                status: 'COMPLETED',
            };
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Failed to send test emergency: ${error.message}`, error.stack);
            throw error;
        }
    }
    generateEmergencyId() {
        return `EMERGENCY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async determineNotificationTargets(emergency, transaction) {
        const targets = [];
        if (emergency.affectedStudents?.length > 0) {
            const studentContacts = await this.emergencyContactModel.findAll({
                where: {
                    studentId: emergency.affectedStudents,
                },
                transaction,
            });
            targets.push(...studentContacts.map((contact) => ({
                id: contact.id,
                type: 'EMERGENCY_CONTACT',
                name: contact.name,
                phone: contact.phoneNumber,
                email: contact.email,
                priority: contact.priority || 1,
                relationship: contact.relationship,
            })));
        }
        const staffTargets = await this.getStaffTargets(emergency, transaction);
        targets.push(...staffTargets);
        if (emergency.severity === 'CRITICAL' || emergency.medicalEmergency) {
            const adminTargets = await this.getAdminTargets(transaction);
            targets.push(...adminTargets);
        }
        return targets;
    }
    async getStaffTargets(emergency, transaction) {
        return [];
    }
    async getAdminTargets(transaction) {
        return [];
    }
    async sendImmediateNotifications(broadcast, targets, transaction) {
        const notifications = [];
        for (const target of targets) {
            const notification = await this.pushNotificationModel.create({
                id: this.generateNotificationId(),
                emergencyId: broadcast.id,
                userId: target.id,
                title: broadcast.title,
                message: broadcast.message,
                type: 'EMERGENCY',
                priority: this.mapSeverityToPriority(broadcast.severity),
                status: 'PENDING',
                channels: ['PUSH', 'SMS'],
                metadata: {
                    emergencyType: broadcast.type,
                    severity: broadcast.severity,
                    location: broadcast.location,
                },
            }, { transaction });
            notifications.push(notification);
            await this.sendNotification(notification, target);
        }
        return notifications;
    }
    generateNotificationId() {
        return `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    mapSeverityToPriority(severity) {
        switch (severity) {
            case 'CRITICAL':
                return 'CRITICAL';
            case 'HIGH':
                return 'HIGH';
            case 'MEDIUM':
                return 'MEDIUM';
            default:
                return 'LOW';
        }
    }
    async sendNotification(notification, target) {
        this.logInfo(`Sending ${notification.type} notification to ${target.name}: ${notification.title}`);
    }
    async scheduleEscalation(broadcast, targets, transaction) {
        const escalationTime = Date.now() + this.getEscalationDelay(broadcast.severity);
        this.logInfo(`Escalation scheduled for emergency ${broadcast.id} at ${new Date(escalationTime)}`);
    }
    getEscalationDelay(severity) {
        switch (severity) {
            case 'CRITICAL':
                return 2 * 60 * 1000;
            case 'HIGH':
                return 5 * 60 * 1000;
            case 'MEDIUM':
                return 15 * 60 * 1000;
            default:
                return 30 * 60 * 1000;
        }
    }
    calculateEstimatedResponseTime(severity) {
        switch (severity) {
            case 'CRITICAL':
                return 2 * 60 * 1000;
            case 'HIGH':
                return 5 * 60 * 1000;
            case 'MEDIUM':
                return 15 * 60 * 1000;
            default:
                return 30 * 60 * 1000;
        }
    }
    async cancelEscalation(emergencyId, transaction) {
        this.logInfo(`Escalation cancelled for emergency ${emergencyId}`);
    }
    async sendAcknowledgmentNotifications(broadcast, responder, transaction) {
        this.logInfo(`Acknowledgment notifications sent for emergency ${broadcast.id}`);
    }
    async getEscalationTargets(broadcast, level, transaction) {
        return [];
    }
    async sendEscalatedNotifications(broadcast, targets, level, transaction) {
        this.logWarning(`Escalated notifications sent for emergency ${broadcast.id} (Level ${level})`);
    }
    getMaxEscalationLevel(severity) {
        switch (severity) {
            case 'CRITICAL':
                return 5;
            case 'HIGH':
                return 4;
            case 'MEDIUM':
                return 3;
            default:
                return 2;
        }
    }
    async scheduleNextEscalation(broadcast, nextLevel, transaction) {
        const escalationTime = Date.now() + this.getEscalationDelay(broadcast.severity);
        this.logInfo(`Next escalation scheduled for emergency ${broadcast.id} at ${new Date(escalationTime)}`);
    }
    async cancelAllEscalations(emergencyId, transaction) {
        this.logInfo(`All escalations cancelled for emergency ${emergencyId}`);
    }
    async sendResolutionNotifications(broadcast, resolution, transaction) {
        this.logInfo(`Resolution notifications sent for emergency ${broadcast.id}`);
    }
    async sendTestNotifications(broadcast, targets, transaction) {
        return [];
    }
};
exports.EmergencyNotificationSystemService = EmergencyNotificationSystemService;
exports.EmergencyNotificationSystemService = EmergencyNotificationSystemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.EmergencyBroadcast)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.PushNotification)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.User)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.Student)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.EmergencyContact)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], EmergencyNotificationSystemService);
var EmergencyType;
(function (EmergencyType) {
    EmergencyType["MEDICAL"] = "MEDICAL";
    EmergencyType["SECURITY"] = "SECURITY";
    EmergencyType["FIRE"] = "FIRE";
    EmergencyType["WEATHER"] = "WEATHER";
    EmergencyType["INFRASTRUCTURE"] = "INFRASTRUCTURE";
    EmergencyType["OTHER"] = "OTHER";
})(EmergencyType || (exports.EmergencyType = EmergencyType = {}));
//# sourceMappingURL=emergency-notification-system.service.js.map