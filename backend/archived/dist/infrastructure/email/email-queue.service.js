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
exports.EmailQueueService = exports.EMAIL_QUEUE_NAME = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
const email_dto_1 = require("./dto/email.dto");
exports.EMAIL_QUEUE_NAME = 'email-queue';
let EmailQueueService = class EmailQueueService extends base_1.BaseService {
    emailQueue;
    configService;
    maxRetries;
    backoffDelay;
    constructor(logger, emailQueue, configService) {
        super({
            serviceName: 'EmailQueueService',
            logger,
            enableAuditLogging: false,
        });
        this.emailQueue = emailQueue;
        this.configService = configService;
        this.maxRetries = this.configService.get('EMAIL_QUEUE_MAX_RETRIES', 3);
        this.backoffDelay = this.configService.get('EMAIL_QUEUE_BACKOFF_DELAY', 5000);
    }
    async onModuleInit() {
        this.logInfo('EmailQueueService initialized');
        await this.logQueueStats();
    }
    async addToQueue(emailData, options) {
        const priority = options?.priority || email_dto_1.EmailPriority.NORMAL;
        const delay = options?.delay || 0;
        const maxRetries = options?.maxRetries || this.maxRetries;
        const jobData = {
            id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            emailData,
            priority,
            retryCount: 0,
            maxRetries,
            createdAt: new Date(),
            scheduledFor: delay > 0 ? new Date(Date.now() + delay) : undefined,
        };
        const job = await this.emailQueue.add('send-email', jobData, {
            priority: this.getPriorityValue(priority),
            delay,
            attempts: maxRetries + 1,
            backoff: {
                type: 'exponential',
                delay: this.backoffDelay,
            },
            removeOnComplete: {
                age: 86400,
                count: 1000,
            },
            removeOnFail: {
                age: 604800,
            },
        });
        this.logInfo(`Email job added to queue: ${job.id} (priority: ${priority})`);
        return job.id || '';
    }
    async processSendEmail(job) {
        const { id, emailData, retryCount } = job.data;
        const attemptNumber = job.attemptsMade;
        this.logInfo(`Processing email job: ${id} (attempt ${attemptNumber}/${job.opts.attempts})`);
        try {
            const result = {
                jobId: job.id || '',
                success: true,
                retryCount: attemptNumber - 1,
                completedAt: new Date(),
            };
            this.logInfo(`Email job completed: ${id}`);
            await job.updateProgress(100);
            return result;
        }
        catch (error) {
            this.logError(`Email job failed: ${id} - ${error.message}`);
            job.data.retryCount = attemptNumber;
            const shouldRetry = attemptNumber < (job.opts.attempts || 1);
            if (shouldRetry) {
                const nextRetryDelay = this.calculateBackoffDelay(attemptNumber);
                this.logWarning(`Email job will retry in ${nextRetryDelay}ms: ${id} (attempt ${attemptNumber}/${job.opts.attempts})`);
                throw error;
            }
            else {
                this.logError(`Email job exhausted all retries: ${id}`);
                await this.moveToDeadLetterQueue(job, error);
                return {
                    jobId: job.id || '',
                    success: false,
                    error: error.message,
                    retryCount: attemptNumber - 1,
                    completedAt: new Date(),
                };
            }
        }
    }
    async getJobStatus(jobId) {
        const job = await this.emailQueue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found`);
        }
        const state = await job.getState();
        const progress = job.progress;
        return {
            status: state,
            progress,
            data: job.data,
            result: job.returnvalue,
            error: job.failedReason,
        };
    }
    async cancelJob(jobId) {
        const job = await this.emailQueue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found`);
        }
        await job.remove();
        this.logInfo(`Email job cancelled: ${jobId}`);
    }
    async getQueueStats() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.emailQueue.getWaitingCount(),
            this.emailQueue.getActiveCount(),
            this.emailQueue.getCompletedCount(),
            this.emailQueue.getFailedCount(),
            this.emailQueue.getDelayedCount(),
        ]);
        return { waiting, active, completed, failed, delayed, paused: 0 };
    }
    async logQueueStats() {
        try {
            const stats = await this.getQueueStats();
            this.logDebug(`Queue stats - Waiting: ${stats.waiting}, Active: ${stats.active}, ` +
                `Completed: ${stats.completed}, Failed: ${stats.failed}, ` +
                `Delayed: ${stats.delayed}, Paused: ${stats.paused}`);
        }
        catch (error) {
            this.logWarning(`Failed to log queue stats: ${error.message}`);
        }
    }
    async clearCompleted(gracePeriodMs = 3600000) {
        await this.emailQueue.clean(gracePeriodMs, 100, 'completed');
        this.logInfo('Cleared completed jobs from queue');
    }
    async clearFailed(gracePeriodMs = 604800000) {
        await this.emailQueue.clean(gracePeriodMs, 100, 'failed');
        this.logInfo('Cleared failed jobs from queue');
    }
    async pauseQueue() {
        await this.emailQueue.pause();
        this.logWarning('Email queue paused');
    }
    async resumeQueue() {
        await this.emailQueue.resume();
        this.logInfo('Email queue resumed');
    }
    async retryFailedJobs() {
        const failedJobs = await this.emailQueue.getFailed();
        let retriedCount = 0;
        for (const job of failedJobs) {
            try {
                await job.retry();
                retriedCount++;
                this.logDebug(`Retrying failed job: ${job.id}`);
            }
            catch (error) {
                this.logWarning(`Failed to retry job ${job.id}: ${error.message}`);
            }
        }
        this.logInfo(`Retried ${retriedCount} failed jobs`);
        return retriedCount;
    }
    getPriorityValue(priority) {
        const priorityMap = {
            [email_dto_1.EmailPriority.URGENT]: 1,
            [email_dto_1.EmailPriority.HIGH]: 2,
            [email_dto_1.EmailPriority.NORMAL]: 3,
            [email_dto_1.EmailPriority.LOW]: 4,
        };
        return priorityMap[priority] || 3;
    }
    calculateBackoffDelay(attemptNumber) {
        return this.backoffDelay * Math.pow(2, attemptNumber - 1);
    }
    async moveToDeadLetterQueue(job, error) {
        this.logError(`Dead letter queue: Job ${job.id} failed permanently`, JSON.stringify({
            jobId: job.id,
            data: job.data,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        }));
    }
    async getJobsByStatus(status, start = 0, end = 10) {
        switch (status) {
            case 'waiting':
                return this.emailQueue.getWaiting(start, end);
            case 'active':
                return this.emailQueue.getActive(start, end);
            case 'completed':
                return this.emailQueue.getCompleted(start, end);
            case 'failed':
                return this.emailQueue.getFailed(start, end);
            case 'delayed':
                return this.emailQueue.getDelayed(start, end);
            default:
                return [];
        }
    }
    async healthCheck() {
        try {
            const stats = await this.getQueueStats();
            const healthy = stats.active >= 0;
            return { healthy, stats };
        }
        catch (error) {
            this.logError(`Queue health check failed: ${error.message}`);
            return { healthy: false, stats: {} };
        }
    }
};
exports.EmailQueueService = EmailQueueService;
__decorate([
    (0, bull_1.Process)('send-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], EmailQueueService.prototype, "processSendEmail", null);
exports.EmailQueueService = EmailQueueService = __decorate([
    (0, bull_1.Processor)(exports.EMAIL_QUEUE_NAME),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, bull_1.InjectQueue)(exports.EMAIL_QUEUE_NAME)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        bullmq_1.Queue,
        config_1.ConfigService])
], EmailQueueService);
//# sourceMappingURL=email-queue.service.js.map