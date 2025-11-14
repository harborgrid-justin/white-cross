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
exports.NotificationQueueService = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../../../../common/config/app-config.service");
const base_1 = require("../../../../common/base");
const logger_service_1 = require("../../../../common/logging/logger.service");
let NotificationQueueService = class NotificationQueueService extends base_1.BaseService {
    config;
    notificationQueue = [];
    queueProcessingInterval;
    constructor(logger, config) {
        super({
            serviceName: 'NotificationQueueService',
            logger,
            enableAuditLogging: false,
        });
        this.config = config;
        if (this.config?.isProduction) {
            this.initializeQueueProcessing();
        }
    }
    initializeQueueProcessing() {
        this.queueProcessingInterval = setInterval(() => this.processNotificationQueue(), 60 * 1000);
        this.logInfo('Notification queue service initialized with periodic processing');
    }
    async enqueueNotification(notification) {
        this.notificationQueue.push(notification);
        this.logDebug(`Notification queued: ${notification.id} (Queue size: ${this.notificationQueue.length})`);
    }
    async processNotificationQueue() {
        if (this.notificationQueue.length === 0) {
            return;
        }
        const batchSize = this.config?.get('notification.batchSize', 10);
        const batch = this.notificationQueue.splice(0, batchSize);
        this.logInfo(`Processing notification batch: ${batch.length} notifications`);
        for (const notification of batch) {
            try {
                await this.processNotification(notification);
                this.logDebug(`Processed notification ${notification.id} (${notification.type})`);
            }
            catch (error) {
                this.logError(`Failed to process notification ${notification.id}: ${error.message}`);
            }
        }
    }
    async processNotification(notification) {
        this.logDebug(`Processing notification: ${notification.id} - ${notification.type}`);
    }
    getQueueSize() {
        return this.notificationQueue.length;
    }
    clearQueue() {
        const size = this.notificationQueue.length;
        this.notificationQueue = [];
        this.logWarning(`Queue cleared: ${size} notifications removed`);
    }
    getQueueStatistics() {
        const stats = {
            size: this.notificationQueue.length,
            oldestTimestamp: undefined,
            newestTimestamp: undefined,
        };
        if (this.notificationQueue.length > 0) {
            stats.oldestTimestamp = this.notificationQueue[0].timestamp;
            stats.newestTimestamp =
                this.notificationQueue[this.notificationQueue.length - 1].timestamp;
        }
        return stats;
    }
    async onModuleDestroy() {
        this.logInfo('NotificationQueueService shutting down - cleaning up resources');
        if (this.queueProcessingInterval) {
            clearInterval(this.queueProcessingInterval);
            this.logInfo('Queue processing interval cleared');
        }
        if (this.notificationQueue.length > 0) {
            this.logInfo(`Processing ${this.notificationQueue.length} remaining notifications before shutdown`);
            try {
                await this.processNotificationQueue();
            }
            catch (error) {
                this.logWarning(`Error processing notification queue during shutdown: ${error.message}`);
            }
        }
        this.logInfo('NotificationQueueService destroyed, resources cleaned up');
    }
};
exports.NotificationQueueService = NotificationQueueService;
exports.NotificationQueueService = NotificationQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        app_config_service_1.AppConfigService])
], NotificationQueueService);
//# sourceMappingURL=notification-queue.service.js.map