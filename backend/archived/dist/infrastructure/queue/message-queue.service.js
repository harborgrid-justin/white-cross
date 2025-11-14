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
exports.MessageQueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const enums_1 = require("./enums");
const queue_config_1 = require("./queue.config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let MessageQueueService = class MessageQueueService extends base_1.BaseService {
    messageDeliveryQueue;
    notificationQueue;
    indexingQueue;
    encryptionQueue;
    batchMessageQueue;
    cleanupQueue;
    queueConfig;
    constructor(logger, messageDeliveryQueue, notificationQueue, indexingQueue, encryptionQueue, batchMessageQueue, cleanupQueue, queueConfig) {
        super({
            serviceName: 'MessageQueueService',
            logger,
            enableAuditLogging: false,
        });
        this.messageDeliveryQueue = messageDeliveryQueue;
        this.notificationQueue = notificationQueue;
        this.indexingQueue = indexingQueue;
        this.encryptionQueue = encryptionQueue;
        this.batchMessageQueue = batchMessageQueue;
        this.cleanupQueue = cleanupQueue;
        this.queueConfig = queueConfig;
    }
    async onModuleInit() {
        this.logInfo('Message Queue Service initialized');
        this.logInfo(`Redis: ${this.queueConfig.getRedisConnectionString()}`);
        this.logQueueConfigurations();
    }
    async onModuleDestroy() {
        this.logInfo('Shutting down Message Queue Service...');
        await this.closeAllQueues();
    }
    logQueueConfigurations() {
        const configs = this.queueConfig.getAllQueueConfigs();
        Object.values(configs).forEach((config) => {
            this.logInfo(`Queue [${config.name}]: concurrency=${config.concurrency}, ` +
                `maxAttempts=${config.maxAttempts}, timeout=${config.timeout}ms`);
        });
    }
    getQueue(queueName) {
        switch (queueName) {
            case enums_1.QueueName.MESSAGE_DELIVERY:
                return this.messageDeliveryQueue;
            case enums_1.QueueName.MESSAGE_NOTIFICATION:
                return this.notificationQueue;
            case enums_1.QueueName.MESSAGE_INDEXING:
                return this.indexingQueue;
            case enums_1.QueueName.MESSAGE_ENCRYPTION:
                return this.encryptionQueue;
            case enums_1.QueueName.BATCH_MESSAGE_SENDING:
                return this.batchMessageQueue;
            case enums_1.QueueName.MESSAGE_CLEANUP:
                return this.cleanupQueue;
            default:
                throw new Error(`Unknown queue: ${queueName}`);
        }
    }
    async addMessageDeliveryJob(data, options) {
        const job = await this.messageDeliveryQueue.add('send-message', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_DELIVERY, options));
        this.logInfo(`Message delivery job added: ${job.id} (messageId: ${data.messageId})`);
        return job;
    }
    async addDeliveryConfirmationJob(data, options) {
        const job = await this.messageDeliveryQueue.add('delivery-confirmation', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_DELIVERY, options));
        this.logInfo(`Delivery confirmation job added: ${job.id} (messageId: ${data.messageId}, status: ${data.status})`);
        return job;
    }
    async addNotificationJob(data, options) {
        const job = await this.notificationQueue.add('send-notification', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_NOTIFICATION, options));
        this.logInfo(`Notification job added: ${job.id} (type: ${data.type}, recipientId: ${data.recipientId})`);
        return job;
    }
    async addEncryptionJob(data, options) {
        const job = await this.encryptionQueue.add('encrypt-decrypt', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_ENCRYPTION, options));
        this.logInfo(`Encryption job added: ${job.id} (operation: ${data.operation}, messageId: ${data.messageId})`);
        return job;
    }
    async addIndexingJob(data, options) {
        const job = await this.indexingQueue.add('index-message', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_INDEXING, options));
        this.logInfo(`Indexing job added: ${job.id} (operation: ${data.operation}, messageId: ${data.messageId})`);
        return job;
    }
    async addBatchMessageJob(data, options) {
        const job = await this.batchMessageQueue.add('batch-send', data, this.buildJobOptions(enums_1.QueueName.BATCH_MESSAGE_SENDING, options));
        this.logInfo(`Batch message job added: ${job.id} (recipients: ${data.recipientIds.length})`);
        return job;
    }
    async addCleanupJob(data, options) {
        const job = await this.cleanupQueue.add('cleanup-messages', data, this.buildJobOptions(enums_1.QueueName.MESSAGE_CLEANUP, options));
        this.logInfo(`Cleanup job added: ${job.id} (type: ${data.cleanupType})`);
        return job;
    }
    buildJobOptions(queueName, options) {
        const config = queue_config_1.QUEUE_CONFIGS[queueName];
        const priorityOptions = options?.priority
            ? this.queueConfig.getJobOptionsForPriority(options.priority)
            : {};
        return {
            priority: options?.priority || enums_1.JobPriority.NORMAL,
            delay: options?.delay || 0,
            attempts: options?.attempts ||
                priorityOptions?.attempts ||
                config.maxAttempts,
            timeout: options?.timeout || config.timeout,
            backoff: options?.backoff ||
                priorityOptions?.backoff || {
                type: config.backoffType,
                delay: config.backoffDelay,
            },
            removeOnComplete: options?.removeOnComplete !== undefined
                ? options.removeOnComplete
                : {
                    count: config.removeOnCompleteCount,
                    age: config.removeOnCompleteAge,
                },
            removeOnFail: options?.removeOnFail !== undefined
                ? options.removeOnFail
                : {
                    count: config.removeOnFailCount,
                    age: config.removeOnFailAge,
                },
            repeat: options?.repeat,
        };
    }
    async getQueueStats(queueName) {
        const queue = this.getQueue(queueName);
        const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
            queue.getPausedCount(),
        ]);
        return {
            name: queueName,
            waiting,
            active,
            completed,
            failed,
            delayed,
            paused,
        };
    }
    async getQueueMetrics() {
        const queueStats = await Promise.all(Object.values(enums_1.QueueName).map((queueName) => this.getQueueStats(queueName)));
        const queues = queueStats.reduce((acc, stats) => {
            acc[stats.name] = stats;
            return acc;
        }, {});
        const totals = queueStats.reduce((acc, stats) => ({
            waiting: acc.waiting + stats.waiting,
            active: acc.active + stats.active,
            completed: acc.completed + stats.completed,
            failed: acc.failed + stats.failed,
            delayed: acc.delayed + stats.delayed,
            paused: acc.paused + stats.paused,
        }), { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, paused: 0 });
        return {
            queues,
            totals,
            timestamp: new Date(),
        };
    }
    async getQueueHealth(queueName) {
        const queue = this.getQueue(queueName);
        const stats = await this.getQueueStats(queueName);
        const totalProcessed = stats.completed + stats.failed;
        const failureRate = totalProcessed > 0 ? stats.failed / totalProcessed : 0;
        const highFailureRate = failureRate > 0.1;
        let redisConnected = true;
        try {
            await queue.client.ping();
        }
        catch (error) {
            redisConnected = false;
        }
        let status = 'healthy';
        if (!redisConnected || highFailureRate) {
            status = 'unhealthy';
        }
        else if (stats.failed > 100 || stats.waiting > 1000) {
            status = 'degraded';
        }
        return {
            name: queueName,
            status,
            checks: {
                redis: redisConnected,
                accepting: stats.paused === 0,
                processing: stats.active > 0 || stats.waiting === 0,
                highFailureRate,
            },
            failureRate,
            checkedAt: new Date(),
        };
    }
    async getFailedJobs(queueName, limit = 100) {
        const queue = this.getQueue(queueName);
        const failedJobs = await queue.getFailed(0, limit - 1);
        return failedJobs.map((job) => ({
            jobId: job.id,
            queueName,
            data: job.data,
            error: {
                message: job.failedReason || 'Unknown error',
                stack: job.stacktrace?.join('\n'),
            },
            attempts: job.attemptsMade,
            failedAt: new Date(job.finishedOn || Date.now()),
            createdAt: new Date(job.timestamp),
        }));
    }
    async pauseQueue(queueName) {
        const queue = this.getQueue(queueName);
        await queue.pause();
        this.logWarning(`Queue paused: ${queueName}`);
    }
    async resumeQueue(queueName) {
        const queue = this.getQueue(queueName);
        await queue.resume();
        this.logInfo(`Queue resumed: ${queueName}`);
    }
    async cleanQueue(queueName, grace = 86400000) {
        const queue = this.getQueue(queueName);
        await queue.clean(grace, 'completed');
        await queue.clean(grace * 7, 'failed');
        this.logInfo(`Queue cleaned: ${queueName}`);
    }
    async retryFailedJob(queueName, jobId) {
        const queue = this.getQueue(queueName);
        const job = await queue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found in queue ${queueName}`);
        }
        await job.retry();
        this.logInfo(`Job retried: ${jobId} in queue ${queueName}`);
    }
    async removeJob(queueName, jobId) {
        const queue = this.getQueue(queueName);
        const job = await queue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found in queue ${queueName}`);
        }
        await job.remove();
        this.logInfo(`Job removed: ${jobId} from queue ${queueName}`);
    }
    async closeAllQueues() {
        const queues = [
            this.messageDeliveryQueue,
            this.notificationQueue,
            this.indexingQueue,
            this.encryptionQueue,
            this.batchMessageQueue,
            this.cleanupQueue,
        ];
        await Promise.all(queues.map((queue) => queue.close()));
        this.logInfo('All queues closed');
    }
};
exports.MessageQueueService = MessageQueueService;
exports.MessageQueueService = MessageQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_DELIVERY)),
    __param(2, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_NOTIFICATION)),
    __param(3, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_INDEXING)),
    __param(4, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_ENCRYPTION)),
    __param(5, (0, bull_1.InjectQueue)(enums_1.QueueName.BATCH_MESSAGE_SENDING)),
    __param(6, (0, bull_1.InjectQueue)(enums_1.QueueName.MESSAGE_CLEANUP)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService, Object, Object, Object, Object, Object, Object, queue_config_1.QueueConfigService])
], MessageQueueService);
//# sourceMappingURL=message-queue.service.js.map