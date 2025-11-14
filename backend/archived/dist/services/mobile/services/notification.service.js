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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const device_token_service_1 = require("./device-token.service");
const notification_analytics_service_1 = require("./notification-analytics.service");
const notification_delivery_service_1 = require("./notification-delivery.service");
const notification_scheduler_service_1 = require("./notification-scheduler.service");
const base_1 = require("../../../common/base");
const notification_template_service_1 = require("./notification-template.service");
let NotificationService = class NotificationService extends base_1.BaseService {
    deviceTokenService;
    deliveryService;
    schedulerService;
    analyticsService;
    templateService;
    constructor(deviceTokenService, deliveryService, schedulerService, analyticsService, templateService) {
        super('NotificationService');
        this.deviceTokenService = deviceTokenService;
        this.deliveryService = deliveryService;
        this.schedulerService = schedulerService;
        this.analyticsService = analyticsService;
        this.templateService = templateService;
    }
    async registerDeviceToken(userId, dto) {
        return this.deviceTokenService.registerDeviceToken(userId, dto);
    }
    async unregisterDeviceToken(userId, tokenId) {
        return this.deviceTokenService.unregisterDeviceToken(userId, tokenId);
    }
    async getUserDevices(userId) {
        return this.deviceTokenService.getUserDevices(userId);
    }
    async updatePreferences(userId, tokenId, dto) {
        return this.deviceTokenService.updatePreferences(userId, tokenId, dto);
    }
    async sendNotification(userId, dto) {
        return this.deliveryService.sendNotification(userId, dto);
    }
    async getNotification(notificationId) {
        return this.deliveryService.getNotification(notificationId);
    }
    getTemplate(templateId) {
        return this.templateService.getTemplate(templateId);
    }
    getAllTemplates() {
        return this.templateService.getAllTemplates();
    }
    getTemplatesByCategory(category) {
        return this.templateService.getTemplatesByCategory(category);
    }
    renderTemplate(templateId, variables) {
        return this.templateService.renderTemplate(templateId, variables);
    }
    async sendFromTemplate(userId, templateId, variables, userIds, options) {
        const template = this.templateService.getTemplate(templateId);
        const { title, body } = this.templateService.renderTemplate(templateId, variables);
        return this.deliveryService.sendNotification(userId, {
            userIds,
            title,
            body,
            category: template.category,
            priority: template.priority,
            sound: template.sound,
            actions: template.actions,
            ...options,
        });
    }
    async processScheduledNotifications() {
        return this.schedulerService.processScheduledNotifications();
    }
    async retryFailedNotifications() {
        return this.schedulerService.retryFailedNotifications();
    }
    async cleanupOldNotifications(retentionDays = 90) {
        return this.schedulerService.cleanupOldNotifications(retentionDays);
    }
    async markExpiredNotifications() {
        return this.schedulerService.markExpiredNotifications();
    }
    async trackInteraction(notificationId, action) {
        return this.analyticsService.trackInteraction(notificationId, action);
    }
    async getAnalytics(period) {
        return this.analyticsService.getAnalytics(period);
    }
    async getNotificationHistory(userId, options) {
        return this.analyticsService.getNotificationHistory(userId, options);
    }
    async getUserNotificationStats(userId, period) {
        return this.analyticsService.getUserNotificationStats(userId, period);
    }
    async getCategoryAnalytics(period) {
        return this.analyticsService.getCategoryAnalytics(period);
    }
    async getEngagementTrends(period, groupBy = 'day') {
        return this.analyticsService.getEngagementTrends(period, groupBy);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [device_token_service_1.DeviceTokenService,
        notification_delivery_service_1.NotificationDeliveryService,
        notification_scheduler_service_1.NotificationSchedulerService,
        notification_analytics_service_1.NotificationAnalyticsService,
        notification_template_service_1.NotificationTemplateService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map