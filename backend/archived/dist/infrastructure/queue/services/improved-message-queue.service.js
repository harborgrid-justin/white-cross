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
exports.ImprovedMessageQueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const queue_config_1 = require("../queue.config");
const base_queue_service_1 = require("./base-queue.service");
let ImprovedMessageQueueService = class ImprovedMessageQueueService extends base_queue_service_1.BaseQueueService {
    messageDeliveryQueue;
    notificationQueue;
    indexingQueue;
    encryptionQueue;
    batchMessageQueue;
    cleanupQueue;
    constructor(messageDeliveryQueue, notificationQueue, indexingQueue, encryptionQueue, batchMessageQueue, cleanupQueue, queueConfig) {
        super(queueConfig, 'ImprovedMessageQueueService');
        this.messageDeliveryQueue = messageDeliveryQueue;
        this.notificationQueue = notificationQueue;
        this.indexingQueue = indexingQueue;
        this.encryptionQueue = encryptionQueue;
        this.batchMessageQueue = batchMessageQueue;
        this.cleanupQueue = cleanupQueue;
        this.registerQueue(enums_1.QueueName.MESSAGE_DELIVERY, messageDeliveryQueue);
        this.registerQueue(enums_1.QueueName.MESSAGE_NOTIFICATION, notificationQueue);
        this.registerQueue(enums_1.QueueName.MESSAGE_INDEXING, indexingQueue);
        this.registerQueue(enums_1.QueueName.MESSAGE_ENCRYPTION, encryptionQueue);
        this.registerQueue(enums_1.QueueName.BATCH_MESSAGE_SENDING, batchMessageQueue);
        this.registerQueue(enums_1.QueueName.MESSAGE_CLEANUP, cleanupQueue);
    }
    async addMessageDeliveryJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_DELIVERY, 'send-message', data, options);
        this.logInfo(`Message delivery job added for messageId: ${data.messageId}`);
        return job;
    }
    async addDeliveryConfirmationJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_DELIVERY, 'delivery-confirmation', data, options);
        this.logInfo(`Delivery confirmation job added for messageId: ${data.messageId}, status: ${data.status}`);
        return job;
    }
    async addNotificationJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_NOTIFICATION, 'send-notification', data, options);
        this.logInfo(`Notification job added: type=${data.type}, recipientId=${data.recipientId}`);
        return job;
    }
    async addEncryptionJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_ENCRYPTION, 'encrypt-decrypt', data, options);
        this.logInfo(`Encryption job added: operation=${data.operation}, messageId=${data.messageId}`);
        return job;
    }
    async addIndexingJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_INDEXING, 'index-message', data, options);
        this.logInfo(`Indexing job added: operation=${data.operation}, messageId=${data.messageId}`);
        return job;
    }
    async addBatchMessageJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.BATCH_MESSAGE_SENDING, 'batch-send', data, options);
        this.logInfo(`Batch message job added with ${data.recipientIds.length} recipients`);
        return job;
    }
    async addCleanupJob(data, options) {
        const job = await this.addJobToQueue(enums_1.QueueName.MESSAGE_CLEANUP, 'cleanup-messages', data, options);
        this.logInfo(`Cleanup job added: type=${data.cleanupType}`);
        return job;
    }
    async addBatchMessageDeliveryJobs(jobs) {
        const batchJobs = jobs.map(({ data, options }) => ({
            name: 'send-message',
            data,
            options,
        }));
        const createdJobs = await this.addBatchJobsToQueue(enums_1.QueueName.MESSAGE_DELIVERY, batchJobs);
        this.logInfo(`Batch message delivery jobs added: ${createdJobs.length} jobs`);
        return createdJobs;
    }
    async addBatchNotificationJobs(jobs) {
        const batchJobs = jobs.map(({ data, options }) => ({
            name: 'send-notification',
            data,
            options,
        }));
        const createdJobs = await this.addBatchJobsToQueue(enums_1.QueueName.MESSAGE_NOTIFICATION, batchJobs);
        this.logInfo(`Batch notification jobs added: ${createdJobs.length} jobs`);
        return createdJobs;
    }
    async getMessageDeliveryHealth() {
        return this.getQueueHealth(enums_1.QueueName.MESSAGE_DELIVERY);
    }
    async getNotificationHealth() {
        return this.getQueueHealth(enums_1.QueueName.MESSAGE_NOTIFICATION);
    }
    async getAllMessageQueueMetrics() {
        return this.getQueueMetrics();
    }
    async cleanAllMessageQueues(grace = 86400000) {
        const queueNames = this.getRegisteredQueueNames();
        await Promise.all(queueNames.map((queueName) => this.cleanQueue(queueName, grace)));
        this.logInfo('All message queues cleaned');
    }
    async pauseAllMessageQueues() {
        const queueNames = this.getRegisteredQueueNames();
        await Promise.all(queueNames.map((queueName) => this.pauseQueue(queueName)));
        this.logWarning('All message queues paused');
    }
    async resumeAllMessageQueues() {
        const queueNames = this.getRegisteredQueueNames();
        await Promise.all(queueNames.map((queueName) => this.resumeQueue(queueName)));
        this.logInfo('All message queues resumed');
    }
};
exports.ImprovedMessageQueueService = ImprovedMessageQueueService;
exports.ImprovedMessageQueueService = ImprovedMessageQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_DELIVERY)),
    __param(1, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_NOTIFICATION)),
    __param(2, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_INDEXING)),
    __param(3, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_ENCRYPTION)),
    __param(4, (0, bull_1.InjectQueue)(enums_1.QueueName.BATCH_MESSAGE_SENDING)),
    __param(5, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_CLEANUP)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, queue_config_1.QueueConfigService])
], ImprovedMessageQueueService);
//# sourceMappingURL=improved-message-queue.service.js.map