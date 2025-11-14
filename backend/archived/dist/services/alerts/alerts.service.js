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
exports.AlertsService = exports.AlertStatus = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../database");
const sequelize_2 = require("sequelize");
const base_1 = require("../../common/base");
const alert_delivery_service_1 = require("./services/alert-delivery.service");
const alert_preferences_service_1 = require("./services/alert-preferences.service");
const alert_statistics_service_1 = require("./services/alert-statistics.service");
const alert_retry_service_1 = require("./services/alert-retry.service");
const alert_exceptions_1 = require("./exceptions/alert.exceptions");
var database_2 = require("../../database");
Object.defineProperty(exports, "AlertStatus", { enumerable: true, get: function () { return database_2.AlertStatus; } });
let AlertsService = class AlertsService extends base_1.BaseService {
    alertModel;
    deliveryService;
    preferencesService;
    statisticsService;
    retryService;
    constructor(alertModel, deliveryService, preferencesService, statisticsService, retryService) {
        super('AlertsService');
        this.alertModel = alertModel;
        this.deliveryService = deliveryService;
        this.preferencesService = preferencesService;
        this.statisticsService = statisticsService;
        this.retryService = retryService;
    }
    async createAlert(data, createdBy) {
        this.logInfo(`Creating alert: ${data.title} [${data.severity}]`);
        const alert = await this.alertModel.create({
            ...data,
            status: database_1.AlertStatus.ACTIVE,
            createdBy,
            requiresAcknowledgment: data.requiresAcknowledgment ?? false,
        });
        await this.deliveryService.deliverAlert(alert);
        if (data.autoEscalateAfter) {
            this.retryService.scheduleAutoEscalation(alert.id, data.autoEscalateAfter);
        }
        if (data.expiresAt) {
            this.retryService.scheduleExpiration(alert.id, data.expiresAt);
        }
        this.logInfo(`Alert created successfully: ${alert.id}`);
        return alert;
    }
    async markAsRead(alertId, userId) {
        const alert = await this.alertModel.findByPk(alertId);
        if (!alert) {
            throw new alert_exceptions_1.AlertNotFoundException(alertId);
        }
        alert.status = database_1.AlertStatus.ACKNOWLEDGED;
        alert.acknowledgedBy = userId;
        alert.acknowledgedAt = new Date();
        await alert.save();
        this.logInfo(`Alert ${alertId} acknowledged by ${userId}`);
        await this.deliveryService.sendViaWebSocket(userId, alert);
        return alert;
    }
    async resolveAlert(alertId, userId, notes) {
        const alert = await this.alertModel.findByPk(alertId);
        if (!alert) {
            throw new alert_exceptions_1.AlertNotFoundException(alertId);
        }
        alert.status = database_1.AlertStatus.RESOLVED;
        alert.resolvedBy = userId;
        alert.resolvedAt = new Date();
        if (notes) {
            alert.metadata = {
                ...alert.metadata,
                resolutionNotes: notes,
            };
        }
        await alert.save();
        this.logInfo(`Alert ${alertId} resolved by ${userId}`);
        await this.deliveryService.sendViaWebSocket(userId, alert);
        return alert;
    }
    async retryFailedAlerts() {
        return this.retryService.retryFailedAlerts();
    }
    async getUserAlertPreferences(userId) {
        return this.preferencesService.getUserAlertPreferences(userId);
    }
    async updateUserAlertPreferences(userId, preferences) {
        return this.preferencesService.updateUserAlertPreferences(userId, preferences);
    }
    async getUserAlerts(userId, filterDto) {
        const { page = 1, limit = 20, unreadOnly = false } = filterDto;
        const where = {
            [sequelize_2.Op.or]: [{ userId }, { schoolId: { [sequelize_2.Op.ne]: null } }],
        };
        if (unreadOnly) {
            where.status = database_1.AlertStatus.ACTIVE;
        }
        const { rows: data, count: total } = await this.alertModel.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async deleteAlert(alertId) {
        const alert = await this.alertModel.findByPk(alertId);
        if (!alert) {
            throw new alert_exceptions_1.AlertNotFoundException(alertId);
        }
        await alert.destroy();
        this.logInfo(`Alert ${alertId} deleted`);
    }
    async getPreferences(userId) {
        return this.preferencesService.getUserAlertPreferences(userId);
    }
    async updatePreferences(userId, updateDto) {
        return this.preferencesService.updateUserAlertPreferences(userId, updateDto);
    }
    async getAlertStatistics(filters) {
        return this.statisticsService.getAlertStatistics(filters);
    }
    async sendViaWebSocket(userId, alert) {
        return this.deliveryService.sendViaWebSocket(userId, alert);
    }
    async sendViaEmail(userId, alert) {
        return this.deliveryService.sendViaEmail(userId, alert);
    }
    async sendViaSMS(userId, alert) {
        return this.deliveryService.sendViaSMS(userId, alert);
    }
    async sendViaPush(userId, alert) {
        return this.deliveryService.sendViaPush(userId, alert);
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Alert)),
    __metadata("design:paramtypes", [Object, alert_delivery_service_1.AlertDeliveryService,
        alert_preferences_service_1.AlertPreferencesService,
        alert_statistics_service_1.AlertStatisticsService,
        alert_retry_service_1.AlertRetryService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map