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
var QueueIntegrationHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueIntegrationHelper = void 0;
const common_1 = require("@nestjs/common");
const message_queue_service_1 = require("../../../infrastructure/queue/message-queue.service");
const enums_1 = require("../../../infrastructure/queue/enums");
const dtos_1 = require("../../../infrastructure/queue/dtos");
let QueueIntegrationHelper = QueueIntegrationHelper_1 = class QueueIntegrationHelper {
    queueService;
    logger = new common_1.Logger(QueueIntegrationHelper_1.name);
    constructor(queueService) {
        this.queueService = queueService;
    }
    async queueMessageWorkflow(context) {
        this.logger.log(`Queueing message workflow for message ${context.messageId}`);
        const result = {
            success: true,
            jobIds: {},
            jobs: {},
            initiatedAt: new Date(),
        };
        const errors = [];
        try {
            if (context.encrypted) {
                try {
                    const encryptionJob = await this.queueEncryption(context);
                    result.jobs.encryption = encryptionJob;
                    result.jobIds.encryption = encryptionJob.id;
                }
                catch (error) {
                    this.logger.error(`Encryption queuing failed: ${error.message}`, error.stack);
                    errors.push({ step: 'encryption', error: error });
                    result.success = false;
                    result.errors = errors;
                    return result;
                }
            }
            try {
                const deliveryJob = await this.queueDelivery(context);
                result.jobs.delivery = deliveryJob;
                result.jobIds.delivery = deliveryJob.id;
            }
            catch (error) {
                this.logger.error(`Delivery queuing failed: ${error.message}`, error.stack);
                errors.push({ step: 'delivery', error: error });
                result.success = false;
                result.errors = errors;
                return result;
            }
            try {
                const notificationJob = await this.queueNotification(context);
                result.jobs.notification = notificationJob;
                result.jobIds.notification = notificationJob.id;
            }
            catch (error) {
                this.logger.warn(`Notification queuing failed (non-critical): ${error.message}`);
                errors.push({ step: 'notification', error: error });
            }
            try {
                const indexingJob = await this.queueIndexing(context);
                result.jobs.indexing = indexingJob;
                result.jobIds.indexing = indexingJob.id;
            }
            catch (error) {
                this.logger.warn(`Indexing queuing failed (non-critical): ${error.message}`);
                errors.push({ step: 'indexing', error: error });
            }
            if (errors.length > 0) {
                result.errors = errors;
            }
            this.logger.log(`Message workflow queued successfully. ` +
                `Jobs created: ${Object.keys(result.jobIds).length}, ` +
                `Errors: ${errors.length}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Unexpected error in message workflow: ${error.message}`, error.stack);
            result.success = false;
            result.errors = [{ step: 'workflow', error: error }];
            return result;
        }
    }
    async queueDelivery(context) {
        const priority = this.mapPriorityToJobPriority(context.priority);
        const jobData = {
            messageId: context.messageId,
            senderId: context.senderId,
            recipientId: context.recipientId,
            content: context.content,
            conversationId: context.conversationId,
            requiresEncryption: context.encrypted,
            attachments: context.attachments,
            createdAt: new Date(),
            initiatedBy: context.senderId,
            metadata: context.metadata,
        };
        return this.queueService.addMessageDeliveryJob(jobData, {
            priority,
            delay: 0,
        });
    }
    async queueNotification(context) {
        const priority = this.mapPriorityToNotificationPriority(context.priority);
        const jobPriority = this.mapPriorityToJobPriority(context.priority);
        const jobData = {
            messageId: context.messageId,
            recipientId: context.recipientId,
            type: dtos_1.NotificationType.IN_APP,
            priority,
            title: 'New Message',
            message: this.truncateContent(context.content, 100),
            createdAt: new Date(),
            initiatedBy: context.senderId,
            metadata: {
                conversationId: context.conversationId,
                senderId: context.senderId,
            },
        };
        return this.queueService.addNotificationJob(jobData, {
            priority: jobPriority,
            delay: 100,
        });
    }
    async queueEncryption(context) {
        const priority = enums_1.JobPriority.HIGH;
        const jobData = {
            messageId: context.messageId,
            operation: 'encrypt',
            content: context.content,
            createdAt: new Date(),
            initiatedBy: context.senderId,
            metadata: context.metadata,
        };
        return this.queueService.addEncryptionJob(jobData, {
            priority,
            delay: 0,
        });
    }
    async queueIndexing(context) {
        const jobData = {
            messageId: context.messageId,
            operation: 'index',
            content: context.content,
            senderId: context.senderId,
            conversationId: context.conversationId,
            messageTimestamp: new Date(),
            createdAt: new Date(),
            initiatedBy: context.senderId,
            metadata: context.metadata,
        };
        return this.queueService.addIndexingJob(jobData, {
            priority: enums_1.JobPriority.LOW,
            delay: 500,
        });
    }
    async queueDeliveryConfirmation(messageId, recipientId, status, failureReason) {
        const jobData = {
            messageId,
            recipientId,
            status: status,
            deliveredAt: status === 'DELIVERED' || status === 'READ' ? new Date() : undefined,
            readAt: status === 'READ' ? new Date() : undefined,
            failureReason,
            createdAt: new Date(),
        };
        return this.queueService.addDeliveryConfirmationJob(jobData, {
            priority: enums_1.JobPriority.NORMAL,
        });
    }
    async getJobStatus(queueName, jobId) {
        try {
            this.logger.debug(`Getting status for job ${jobId} in queue ${queueName}`);
            return null;
        }
        catch (error) {
            this.logger.error(`Error getting job status: ${error.message}`, error.stack);
            return null;
        }
    }
    async aggregateJobResults(jobIds) {
        const results = [];
        const completed = 0;
        const failed = 0;
        let pending = 0;
        for (const jobId of jobIds) {
            const status = 'pending';
            results.push({
                jobId,
                status,
            });
            pending++;
        }
        return {
            total: jobIds.length,
            completed,
            failed,
            pending,
            results,
        };
    }
    async retryFailedJob(queueName, jobId) {
        await this.queueService.retryFailedJob(queueName, jobId);
        this.logger.log(`Retried job ${jobId} in queue ${queueName}`);
    }
    mapPriorityToJobPriority(priority) {
        switch (priority) {
            case 'URGENT':
                return enums_1.JobPriority.CRITICAL;
            case 'HIGH':
                return enums_1.JobPriority.HIGH;
            case 'MEDIUM':
                return enums_1.JobPriority.NORMAL;
            case 'LOW':
            default:
                return enums_1.JobPriority.LOW;
        }
    }
    mapPriorityToNotificationPriority(priority) {
        switch (priority) {
            case 'URGENT':
                return dtos_1.NotificationPriority.URGENT;
            case 'HIGH':
                return dtos_1.NotificationPriority.HIGH;
            case 'MEDIUM':
                return dtos_1.NotificationPriority.NORMAL;
            case 'LOW':
            default:
                return dtos_1.NotificationPriority.LOW;
        }
    }
    truncateContent(content, maxLength) {
        if (content.length <= maxLength) {
            return content;
        }
        return content.substring(0, maxLength - 3) + '...';
    }
};
exports.QueueIntegrationHelper = QueueIntegrationHelper;
exports.QueueIntegrationHelper = QueueIntegrationHelper = QueueIntegrationHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_queue_service_1.MessageQueueService])
], QueueIntegrationHelper);
//# sourceMappingURL=queue-integration.helper.js.map