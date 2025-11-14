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
exports.AlertRetryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const alert_delivery_service_1 = require("./alert-delivery.service");
const base_1 = require("../../../common/base");
let AlertRetryService = class AlertRetryService extends base_1.BaseService {
    alertModel;
    deliveryLogModel;
    deliveryService;
    constructor(alertModel, deliveryLogModel, deliveryService) {
        super("AlertRetryService");
        this.alertModel = alertModel;
        this.deliveryLogModel = deliveryLogModel;
        this.deliveryService = deliveryService;
    }
    async retryFailedAlerts() {
        this.logInfo('Checking for failed alert deliveries to retry...');
        let retriedCount = 0;
        const failedLogs = await this.deliveryLogModel.findAll({
            where: {
                success: false,
            },
            include: [database_1.Alert],
        });
        for (const log of failedLogs) {
            if (!log.isReadyForRetry()) {
                continue;
            }
            const alert = log.alert || (await this.alertModel.findByPk(log.alertId));
            if (!alert)
                continue;
            try {
                await this.deliveryService.retryDelivery(alert, log.channel, log.recipientId);
                retriedCount++;
            }
            catch (error) {
                this.logError(`Retry failed for alert ${log.alertId} on ${log.channel}`, error);
            }
        }
        this.logInfo(`Retried ${retriedCount} failed alert deliveries`);
    }
    scheduleAutoEscalation(alertId, delayMinutes) {
        this.logInfo(`Scheduling auto-escalation for alert ${alertId} in ${delayMinutes} minutes`);
        setTimeout(async () => {
            const alert = await this.alertModel.findByPk(alertId);
            if (alert &&
                alert.status === 'ACTIVE' &&
                !alert.acknowledgedAt) {
                alert.escalationLevel = (alert.escalationLevel || 0) + 1;
                await alert.save();
                this.logWarning(`Alert ${alertId} auto-escalated to level ${alert.escalationLevel}`);
            }
        }, delayMinutes * 60 * 1000);
    }
    scheduleExpiration(alertId, expiresAt) {
        const delay = expiresAt.getTime() - Date.now();
        if (delay <= 0) {
            return;
        }
        setTimeout(async () => {
            const alert = await this.alertModel.findByPk(alertId);
            if (alert && alert.status === 'ACTIVE') {
                alert.status = 'EXPIRED';
                await alert.save();
                this.logInfo(`Alert ${alertId} expired`);
            }
        }, delay);
    }
    async getRetryStatistics() {
        const allFailedLogs = await this.deliveryLogModel.findAll({
            where: {
                success: false,
            },
        });
        const retriesInProgress = allFailedLogs.filter(log => log.isReadyForRetry()).length;
        const maxRetriesExceeded = allFailedLogs.filter(log => !log.isReadyForRetry()).length;
        const successfulRetries = await this.deliveryLogModel.count({
            where: {
                success: true,
                attemptCount: { [Op.gt]: 1 },
            },
        });
        return {
            totalFailedDeliveries: allFailedLogs.length,
            retriesInProgress,
            maxRetriesExceeded,
            successfulRetries,
        };
    }
    async forceRetryAlert(alertId, channel) {
        const alert = await this.alertModel.findByPk(alertId);
        if (!alert) {
            throw new Error(`Alert ${alertId} not found`);
        }
        if (channel) {
            const deliveryChannel = channel;
            await this.deliveryService.retryDelivery(alert, deliveryChannel);
            this.logInfo(`Force retried alert ${alertId} on ${channel}`);
        }
        else {
            const failedLogs = await this.deliveryLogModel.findAll({
                where: {
                    alertId,
                    success: false,
                },
            });
            for (const log of failedLogs) {
                try {
                    await this.deliveryService.retryDelivery(alert, log.channel, log.recipientId);
                }
                catch (error) {
                    this.logError(`Force retry failed for alert ${alertId} on ${log.channel}`, error);
                }
            }
            this.logInfo(`Force retried all failed deliveries for alert ${alertId}`);
        }
    }
    async cleanupOldFailedLogs(olderThanDays = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        const deletedCount = await this.deliveryLogModel.destroy({
            where: {
                success: false,
                lastAttempt: {
                    [Op.lt]: cutoffDate,
                },
            },
        });
        this.logInfo(`Cleaned up ${deletedCount} old failed delivery logs`);
        return deletedCount;
    }
};
exports.AlertRetryService = AlertRetryService;
exports.AlertRetryService = AlertRetryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Alert)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.DeliveryLog)),
    __metadata("design:paramtypes", [Object, Object, alert_delivery_service_1.AlertDeliveryService])
], AlertRetryService);
//# sourceMappingURL=alert-retry.service.js.map