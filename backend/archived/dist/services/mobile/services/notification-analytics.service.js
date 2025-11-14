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
exports.NotificationAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const push_notification_model_1 = require("../../../database/models/push-notification.model");
const enums_1 = require("../enums");
const base_1 = require("../../../common/base");
let NotificationAnalyticsService = class NotificationAnalyticsService extends base_1.BaseService {
    notificationModel;
    constructor(notificationModel) {
        super("NotificationAnalyticsService");
        this.notificationModel = notificationModel;
    }
    async trackInteraction(notificationId, action) {
        const notification = await this.notificationModel.findOne({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (action === 'CLICKED') {
            notification.clickedCount++;
        }
        else if (action === 'DISMISSED') {
            notification.dismissedCount++;
        }
        await notification.save();
        this.logInfo(`Interaction tracked: ${notificationId} - ${action}`);
    }
    async getAnalytics(period) {
        const notifications = await this.notificationModel.findAll({
            where: {
                createdAt: {
                    [sequelize_2.Op.gte]: period.start,
                    [sequelize_2.Op.lte]: period.end,
                },
            },
        });
        const totalSent = notifications.length;
        const totalDelivered = notifications.filter((n) => n.status === enums_1.NotificationStatus.DELIVERED).length;
        const totalFailed = notifications.filter((n) => n.status === enums_1.NotificationStatus.FAILED).length;
        const totalClicked = notifications.reduce((sum, n) => sum + n.clickedCount, 0);
        const totalDismissed = notifications.reduce((sum, n) => sum + n.dismissedCount, 0);
        const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
        const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;
        const dismissalRate = totalDelivered > 0 ? (totalDismissed / totalDelivered) * 100 : 0;
        return {
            period,
            totalSent,
            totalDelivered,
            totalFailed,
            totalClicked,
            totalDismissed,
            deliveryRate: Number(deliveryRate.toFixed(2)),
            clickRate: Number(clickRate.toFixed(2)),
            dismissalRate: Number(dismissalRate.toFixed(2)),
        };
    }
    async getNotificationHistory(userId, options) {
        const where = {
            userIds: {
                [sequelize_2.Op.contains]: [userId],
            },
        };
        if (options?.status) {
            where.status = options.status;
        }
        if (options?.category) {
            where.category = options.category;
        }
        return this.notificationModel.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: options?.limit,
            offset: options?.offset,
        });
    }
    async getUserNotificationStats(userId, period) {
        const where = {
            userIds: {
                [sequelize_2.Op.contains]: [userId],
            },
        };
        if (period) {
            where.createdAt = {
                [sequelize_2.Op.gte]: period.start,
                [sequelize_2.Op.lte]: period.end,
            };
        }
        const notifications = await this.notificationModel.findAll({
            where,
        });
        const total = notifications.length;
        const delivered = notifications.filter((n) => n.status === enums_1.NotificationStatus.DELIVERED).length;
        const clicked = notifications.reduce((sum, n) => sum + n.clickedCount, 0);
        const dismissed = notifications.reduce((sum, n) => sum + n.dismissedCount, 0);
        const byCategory = {};
        const byPriority = {};
        for (const notification of notifications) {
            byCategory[notification.category] =
                (byCategory[notification.category] || 0) + 1;
            byPriority[notification.priority] =
                (byPriority[notification.priority] || 0) + 1;
        }
        return {
            total,
            delivered,
            clicked,
            dismissed,
            byCategory,
            byPriority,
        };
    }
    async getCategoryAnalytics(period) {
        const notifications = await this.notificationModel.findAll({
            where: {
                createdAt: {
                    [sequelize_2.Op.gte]: period.start,
                    [sequelize_2.Op.lte]: period.end,
                },
            },
        });
        const categoryMap = new Map();
        for (const notification of notifications) {
            const existing = categoryMap.get(notification.category) || {
                count: 0,
                delivered: 0,
                clicked: 0,
            };
            existing.count++;
            if (notification.status === enums_1.NotificationStatus.DELIVERED) {
                existing.delivered++;
            }
            existing.clicked += notification.clickedCount;
            categoryMap.set(notification.category, existing);
        }
        return Array.from(categoryMap.entries()).map(([category, stats]) => ({
            category,
            count: stats.count,
            delivered: stats.delivered,
            clicked: stats.clicked,
            deliveryRate: stats.count > 0
                ? Number(((stats.delivered / stats.count) * 100).toFixed(2))
                : 0,
            clickRate: stats.delivered > 0
                ? Number(((stats.clicked / stats.delivered) * 100).toFixed(2))
                : 0,
        }));
    }
    async getEngagementTrends(period, groupBy = 'day') {
        const notifications = await this.notificationModel.findAll({
            where: {
                createdAt: {
                    [sequelize_2.Op.gte]: period.start,
                    [sequelize_2.Op.lte]: period.end,
                },
            },
            order: [['createdAt', 'ASC']],
        });
        const trends = new Map();
        for (const notification of notifications) {
            const date = this.formatDateByGroup(notification.createdAt, groupBy);
            const existing = trends.get(date) || {
                sent: 0,
                delivered: 0,
                clicked: 0,
                dismissed: 0,
            };
            existing.sent++;
            if (notification.status === enums_1.NotificationStatus.DELIVERED) {
                existing.delivered++;
            }
            existing.clicked += notification.clickedCount;
            existing.dismissed += notification.dismissedCount;
            trends.set(date, existing);
        }
        return Array.from(trends.entries())
            .map(([date, stats]) => ({
            date,
            ...stats,
        }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    formatDateByGroup(date, groupBy) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        switch (groupBy) {
            case 'day':
                return `${year}-${month}-${day}`;
            case 'week':
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                return `${weekStart.getFullYear()}-W${String(this.getWeekNumber(weekStart)).padStart(2, '0')}`;
            case 'month':
                return `${year}-${month}`;
            default:
                return `${year}-${month}-${day}`;
        }
    }
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }
};
exports.NotificationAnalyticsService = NotificationAnalyticsService;
exports.NotificationAnalyticsService = NotificationAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(push_notification_model_1.PushNotification)),
    __metadata("design:paramtypes", [Object])
], NotificationAnalyticsService);
//# sourceMappingURL=notification-analytics.service.js.map