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
exports.AlertDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const database_1 = require("../../../database");
const alert_exceptions_1 = require("../exceptions/alert.exceptions");
const base_1 = require("../../../common/base");
let AlertDeliveryService = class AlertDeliveryService extends base_1.BaseService {
    deliveryLogModel;
    configService;
    constructor(deliveryLogModel, configService) {
        super("AlertDeliveryService");
        this.deliveryLogModel = deliveryLogModel;
        this.configService = configService;
    }
    async sendViaWebSocket(userId, alert) {
        try {
            const rooms = [];
            if (alert.schoolId) {
                rooms.push(`school:${alert.schoolId}`);
            }
            if (alert.userId) {
                rooms.push(`user:${alert.userId}`);
            }
            if (alert.studentId) {
                rooms.push(`student:${alert.studentId}`);
            }
            if (alert.severity === 'EMERGENCY' ||
                alert.severity === 'CRITICAL') {
                rooms.push('alerts:critical');
            }
            this.logInfo(`Broadcasting alert ${alert.id} to rooms: ${rooms.join(', ')}`);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.WEBSOCKET, undefined, true);
        }
        catch (error) {
            this.logError(`WebSocket delivery failed for alert ${alert.id}`, error);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.WEBSOCKET, undefined, false, error.message);
        }
    }
    async sendViaEmail(userId, alert) {
        try {
            const emailConfig = {
                host: this.configService.get('SMTP_HOST'),
                port: this.configService.get('SMTP_PORT', 587),
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASSWORD'),
            };
            this.logInfo(`Sending email alert ${alert.id} to user ${userId}`);
            this.logDebug(`Email subject: [${alert.severity}] ${alert.title}`);
            this.logDebug(`Email body: ${alert.message}`);
            await this.simulateDelay(100);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.EMAIL, userId, true);
        }
        catch (error) {
            this.logError(`Email delivery failed for alert ${alert.id}`, error);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.EMAIL, userId, false, error.message);
            throw new alert_exceptions_1.AlertDeliveryException('Email', error.message);
        }
    }
    async sendViaSMS(userId, alert) {
        try {
            const smsConfig = {
                accountSid: this.configService.get('TWILIO_ACCOUNT_SID'),
                authToken: this.configService.get('TWILIO_AUTH_TOKEN'),
                fromNumber: this.configService.get('TWILIO_PHONE_NUMBER'),
            };
            const smsMessage = `[${alert.severity}] ${alert.title}: ${alert.message.substring(0, 100)}`;
            this.logInfo(`Sending SMS alert ${alert.id} to user ${userId}`);
            this.logDebug(`SMS message: ${smsMessage}`);
            await this.simulateDelay(150);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.SMS, userId, true);
        }
        catch (error) {
            this.logError(`SMS delivery failed for alert ${alert.id}`, error);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.SMS, userId, false, error.message);
            throw new alert_exceptions_1.AlertDeliveryException('SMS', error.message);
        }
    }
    async sendViaPush(userId, alert) {
        try {
            const fcmConfig = {
                serverKey: this.configService.get('FCM_SERVER_KEY'),
                projectId: this.configService.get('FCM_PROJECT_ID'),
            };
            const pushPayload = {
                notification: {
                    title: `[${alert.severity}] ${alert.title}`,
                    body: alert.message,
                    icon: this.getSeverityIcon(alert.severity),
                },
                data: {
                    alertId: alert.id,
                    category: alert.category,
                    severity: alert.severity,
                },
            };
            this.logInfo(`Sending push notification for alert ${alert.id} to user ${userId}`);
            this.logDebug(`Push payload: ${JSON.stringify(pushPayload)}`);
            await this.simulateDelay(120);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.PUSH_NOTIFICATION, userId, true);
        }
        catch (error) {
            this.logError(`Push notification delivery failed for alert ${alert.id}`, error);
            await this.logDelivery(alert.id, database_1.DeliveryChannel.PUSH_NOTIFICATION, userId, false, error.message);
            throw new alert_exceptions_1.AlertDeliveryException('Push Notification', error.message);
        }
    }
    async retryDelivery(alert, channel, recipientId) {
        this.logInfo(`Retrying delivery for alert ${alert.id} via ${channel}`);
        switch (channel) {
            case database_1.DeliveryChannel.EMAIL:
                await this.sendViaEmail(recipientId || alert.userId || '', alert);
                break;
            case database_1.DeliveryChannel.SMS:
                await this.sendViaSMS(recipientId || alert.userId || '', alert);
                break;
            case database_1.DeliveryChannel.PUSH_NOTIFICATION:
                await this.sendViaPush(recipientId || alert.userId || '', alert);
                break;
            case database_1.DeliveryChannel.WEBSOCKET:
                await this.sendViaWebSocket(recipientId || alert.userId || '', alert);
                break;
        }
    }
    async logDelivery(alertId, channel, recipientId, success, errorMessage) {
        const existingLog = await this.deliveryLogModel.findOne({
            where: {
                alertId,
                channel,
                ...(recipientId && { recipientId }),
            },
        });
        if (existingLog) {
            existingLog.success = success;
            existingLog.attemptCount++;
            existingLog.lastAttempt = new Date();
            if (success) {
                existingLog.deliveredAt = new Date();
            }
            if (errorMessage) {
                existingLog.errorMessage = errorMessage;
            }
            await existingLog.save();
        }
        else {
            await this.deliveryLogModel.create({
                alertId,
                channel,
                recipientId,
                success,
                attemptCount: 1,
                lastAttempt: new Date(),
                deliveredAt: success ? new Date() : undefined,
                errorMessage,
            });
        }
    }
    getSeverityIcon(severity) {
        const icons = {
            INFO: 'info_icon',
            LOW: 'low_icon',
            MEDIUM: 'medium_icon',
            HIGH: 'high_icon',
            CRITICAL: 'critical_icon',
            EMERGENCY: 'emergency_icon',
        };
        return icons[severity] || 'default_icon';
    }
    simulateDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.AlertDeliveryService = AlertDeliveryService;
exports.AlertDeliveryService = AlertDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.DeliveryLog)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], AlertDeliveryService);
//# sourceMappingURL=alert-delivery.service.js.map