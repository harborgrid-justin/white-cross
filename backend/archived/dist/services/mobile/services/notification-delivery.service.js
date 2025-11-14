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
exports.NotificationDeliveryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const device_token_model_1 = require("../../../database/models/device-token.model");
const push_notification_model_1 = require("../../../database/models/push-notification.model");
const enums_1 = require("../enums");
const notification_platform_service_1 = require("./notification-platform.service");
const device_token_service_1 = require("./device-token.service");
const base_1 = require("../../../common/base");
let NotificationDeliveryService = class NotificationDeliveryService extends base_1.BaseService {
    notificationModel;
    deviceTokenModel;
    platformService;
    deviceTokenService;
    constructor(notificationModel, deviceTokenModel, platformService, deviceTokenService) {
        super("NotificationDeliveryService");
        this.notificationModel = notificationModel;
        this.deviceTokenModel = deviceTokenModel;
        this.platformService = platformService;
        this.deviceTokenService = deviceTokenService;
    }
    async sendNotification(userId, dto) {
        try {
            const deviceTokens = await this.deviceTokenService.getActiveTokensForUsers(dto.userIds);
            const notification = await this.notificationModel.create({
                userIds: dto.userIds,
                deviceTokens: deviceTokens.map((t) => t.token),
                title: dto.title,
                body: dto.body,
                category: dto.category,
                priority: dto.priority || enums_1.NotificationPriority.NORMAL,
                data: dto.data,
                actions: dto.actions,
                imageUrl: dto.imageUrl,
                sound: dto.sound,
                badge: dto.badge,
                scheduledFor: dto.scheduledFor,
                status: dto.scheduledFor
                    ? enums_1.NotificationStatus.SCHEDULED
                    : enums_1.NotificationStatus.PENDING,
                totalRecipients: deviceTokens.length,
                successfulDeliveries: 0,
                failedDeliveries: 0,
                deliveryResults: [],
                createdBy: userId,
                silent: false,
                requireInteraction: false,
                clickedCount: 0,
                dismissedCount: 0,
                retryCount: 0,
                maxRetries: 3,
            });
            if (!dto.scheduledFor && notification.id) {
                await this.deliverNotification(notification.id);
            }
            this.logInfo(`Notification created: ${notification.id} for ${deviceTokens.length} recipients`);
            return notification;
        }
        catch (error) {
            this.logError('Error sending notification', error);
            throw error;
        }
    }
    async deliverNotification(notificationId) {
        try {
            const notification = await this.notificationModel.findOne({
                where: { id: notificationId },
            });
            if (!notification) {
                throw new common_1.NotFoundException('Notification not found');
            }
            notification.status = enums_1.NotificationStatus.SENDING;
            notification.sentAt = new Date();
            await notification.save();
            const tokens = await this.deviceTokenModel.findAll({
                where: {
                    token: notification.deviceTokens,
                    isActive: true,
                    isValid: true,
                },
            });
            const byPlatform = new Map();
            for (const token of tokens) {
                if (!byPlatform.has(token.platform)) {
                    byPlatform.set(token.platform, []);
                }
                byPlatform.get(token.platform).push(token);
            }
            for (const [platform, platformTokens] of byPlatform) {
                for (const token of platformTokens) {
                    if (!token.allowNotifications)
                        continue;
                    try {
                        const result = await this.platformService.sendToPlatform(platform, token, notification);
                        notification.deliveryResults.push({
                            platform,
                            deviceToken: token.token,
                            status: result.success
                                ? enums_1.DeliveryStatus.SUCCESS
                                : enums_1.DeliveryStatus.FAILED,
                            response: result.response,
                            error: result.error,
                            deliveredAt: result.success ? new Date() : undefined,
                        });
                        if (result.success) {
                            notification.successfulDeliveries++;
                            await this.deviceTokenService.updateLastUsed(token.id);
                        }
                        else {
                            notification.failedDeliveries++;
                            if (result.invalidToken) {
                                await this.deviceTokenService.markTokenAsInvalid(token.id, result.error || 'Unknown error');
                            }
                        }
                    }
                    catch (error) {
                        notification.deliveryResults.push({
                            platform,
                            deviceToken: token.token,
                            status: enums_1.DeliveryStatus.FAILED,
                            error: String(error),
                        });
                        notification.failedDeliveries++;
                    }
                }
            }
            if (notification.successfulDeliveries > 0) {
                notification.status = enums_1.NotificationStatus.DELIVERED;
                notification.deliveredAt = new Date();
            }
            else {
                notification.status = enums_1.NotificationStatus.FAILED;
                notification.failedAt = new Date();
                if (notification.retryCount < notification.maxRetries) {
                    notification.nextRetryAt = this.calculateRetryTime(notification.retryCount);
                }
            }
            await notification.save();
            this.logInfo(`Notification delivered: ${notificationId} - ${notification.successfulDeliveries} success, ${notification.failedDeliveries} failed`);
        }
        catch (error) {
            this.logError('Error delivering notification', error);
            throw error;
        }
    }
    async getNotification(notificationId) {
        const notification = await this.notificationModel.findOne({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    calculateRetryTime(retryCount) {
        const delays = [5, 15, 30];
        const delayMinutes = delays[Math.min(retryCount, delays.length - 1)];
        const nextRetry = new Date();
        nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
        return nextRetry;
    }
};
exports.NotificationDeliveryService = NotificationDeliveryService;
exports.NotificationDeliveryService = NotificationDeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(push_notification_model_1.PushNotification)),
    __param(1, (0, sequelize_1.InjectModel)(device_token_model_1.DeviceToken)),
    __metadata("design:paramtypes", [Object, Object, notification_platform_service_1.NotificationPlatformService,
        device_token_service_1.DeviceTokenService])
], NotificationDeliveryService);
//# sourceMappingURL=notification-delivery.service.js.map