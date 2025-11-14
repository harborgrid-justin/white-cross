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
exports.NotificationSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const push_notification_model_1 = require("../../../database/models/push-notification.model");
const enums_1 = require("../enums");
const notification_delivery_service_1 = require("./notification-delivery.service");
const base_1 = require("../../../common/base");
let NotificationSchedulerService = class NotificationSchedulerService extends base_1.BaseService {
    notificationModel;
    deliveryService;
    constructor(notificationModel, deliveryService) {
        super("NotificationSchedulerService");
        this.notificationModel = notificationModel;
        this.deliveryService = deliveryService;
    }
    async processScheduledNotifications() {
        try {
            const now = new Date();
            const scheduledNotifications = await this.notificationModel.findAll({
                where: {
                    status: enums_1.NotificationStatus.SCHEDULED,
                    scheduledFor: {
                        [sequelize_2.Op.lte]: now,
                    },
                },
                order: [['scheduledFor', 'ASC']],
                limit: 100,
            });
            this.logInfo(`Processing ${scheduledNotifications.length} scheduled notifications`);
            for (const notification of scheduledNotifications) {
                try {
                    if (notification.expiresAt && notification.expiresAt < now) {
                        notification.status = enums_1.NotificationStatus.EXPIRED;
                        await notification.save();
                        this.logWarning(`Notification ${notification.id} expired`);
                        continue;
                    }
                    if (notification.id) {
                        await this.deliveryService.deliverNotification(notification.id);
                    }
                }
                catch (error) {
                    this.logError(`Failed to deliver scheduled notification ${notification.id}`, error);
                }
            }
            return scheduledNotifications.length;
        }
        catch (error) {
            this.logError('Error processing scheduled notifications', error);
            return 0;
        }
    }
    async retryFailedNotifications() {
        try {
            const now = new Date();
            const failedNotifications = await this.notificationModel.findAll({
                where: {
                    status: enums_1.NotificationStatus.FAILED,
                },
                order: [['nextRetryAt', 'ASC']],
                limit: 50,
            });
            const eligibleNotifications = failedNotifications.filter((n) => n.retryCount < n.maxRetries &&
                (!n.nextRetryAt || n.nextRetryAt <= now));
            this.logInfo(`Retrying ${eligibleNotifications.length} failed notifications`);
            for (const notification of eligibleNotifications) {
                try {
                    notification.retryCount++;
                    notification.status = enums_1.NotificationStatus.PENDING;
                    notification.nextRetryAt = undefined;
                    await notification.save();
                    if (notification.id) {
                        await this.deliveryService.deliverNotification(notification.id);
                    }
                }
                catch (error) {
                    this.logError(`Failed to retry notification ${notification.id}`, error);
                }
            }
            return eligibleNotifications.length;
        }
        catch (error) {
            this.logError('Error retrying failed notifications', error);
            return 0;
        }
    }
    async cleanupOldNotifications(retentionDays = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
            const deletedCount = await this.notificationModel.destroy({
                where: {
                    createdAt: {
                        [sequelize_2.Op.lt]: cutoffDate,
                    },
                    status: {
                        [sequelize_2.Op.in]: [enums_1.NotificationStatus.DELIVERED, enums_1.NotificationStatus.EXPIRED],
                    },
                },
            });
            this.logInfo(`Cleaned up ${deletedCount} old notifications (older than ${retentionDays} days)`);
            return deletedCount;
        }
        catch (error) {
            this.logError('Error cleaning up old notifications', error);
            return 0;
        }
    }
    async markExpiredNotifications() {
        try {
            const now = new Date();
            const [updatedCount] = await this.notificationModel.update({ status: enums_1.NotificationStatus.EXPIRED }, {
                where: {
                    status: {
                        [sequelize_2.Op.in]: [enums_1.NotificationStatus.SCHEDULED, enums_1.NotificationStatus.PENDING],
                    },
                    expiresAt: {
                        [sequelize_2.Op.lt]: now,
                    },
                },
            });
            if (updatedCount > 0) {
                this.logInfo(`Marked ${updatedCount} notifications as expired`);
            }
            return updatedCount;
        }
        catch (error) {
            this.logError('Error marking expired notifications', error);
            return 0;
        }
    }
    async getSchedulerStats() {
        const now = new Date();
        const [scheduled, pendingRetry, expired] = await Promise.all([
            this.notificationModel.count({
                where: {
                    status: enums_1.NotificationStatus.SCHEDULED,
                    scheduledFor: {
                        [sequelize_2.Op.gt]: now,
                    },
                },
            }),
            this.notificationModel.count({
                where: {
                    status: enums_1.NotificationStatus.FAILED,
                    retryCount: {
                        [sequelize_2.Op.lt]: this.notificationModel.sequelize.col('maxRetries'),
                    },
                },
            }),
            this.notificationModel.count({
                where: {
                    status: enums_1.NotificationStatus.EXPIRED,
                },
            }),
        ]);
        return {
            scheduled,
            pendingRetry,
            expired,
        };
    }
};
exports.NotificationSchedulerService = NotificationSchedulerService;
exports.NotificationSchedulerService = NotificationSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(push_notification_model_1.PushNotification)),
    __metadata("design:paramtypes", [Object, notification_delivery_service_1.NotificationDeliveryService])
], NotificationSchedulerService);
//# sourceMappingURL=notification-scheduler.service.js.map