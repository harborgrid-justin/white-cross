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
exports.QueueSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const enums_1 = require("../enums");
const base_1 = require("../../../common/base");
let QueueSchedulerService = class QueueSchedulerService extends base_1.BaseService {
    scheduledJobs = new Map();
    executionHistory = [];
    queueServices = [];
    constructor() {
        super("QueueSchedulerService");
        this.logInfo('Queue Scheduler Service initialized');
        this.setupDefaultScheduledJobs();
    }
    registerQueueService(service) {
        this.queueServices.push(service);
        this.logInfo(`Queue service registered for scheduling: ${service.constructor.name}`);
    }
    registerScheduledJob(config) {
        this.scheduledJobs.set(config.id, config);
        this.logInfo(`Scheduled job registered: ${config.id} (${config.cronExpression})`);
    }
    removeScheduledJob(id) {
        const removed = this.scheduledJobs.delete(id);
        if (removed) {
            this.logInfo(`Scheduled job removed: ${id}`);
        }
        return removed;
    }
    setScheduledJobEnabled(id, enabled) {
        const job = this.scheduledJobs.get(id);
        if (job) {
            job.enabled = enabled;
            this.logInfo(`Scheduled job ${id} ${enabled ? 'enabled' : 'disabled'}`);
            return true;
        }
        return false;
    }
    getScheduledJobs() {
        return Array.from(this.scheduledJobs.values());
    }
    getScheduledJob(id) {
        return this.scheduledJobs.get(id);
    }
    getExecutionHistory(limit = 100) {
        return this.executionHistory
            .sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())
            .slice(0, limit);
    }
    async executeScheduledJob(id) {
        const config = this.scheduledJobs.get(id);
        if (!config) {
            throw new Error(`Scheduled job not found: ${id}`);
        }
        return this.executeJob(config);
    }
    async scheduleDelayedJob(queueService, queueName, jobName, data, delayMs, options) {
        const jobOptions = {
            ...options,
            delay: delayMs,
        };
        const job = await queueService.addJobToQueue(queueName, jobName, data, jobOptions);
        this.logInfo(`Delayed job scheduled: ${jobName} in queue ${queueName} (delay: ${delayMs}ms)`);
        return job;
    }
    async scheduleRecurringJob(queueService, queueName, jobName, data, intervalMs, options) {
        const jobOptions = {
            ...options,
            repeat: {
                every: intervalMs,
            },
        };
        const job = await queueService.addJobToQueue(queueName, jobName, data, jobOptions);
        this.logInfo(`Recurring job scheduled: ${jobName} in queue ${queueName} (interval: ${intervalMs}ms)`);
        return job;
    }
    setupDefaultScheduledJobs() {
        this.registerScheduledJob({
            id: 'queue-cleanup',
            cronExpression: '0 3 * * *',
            queueName: enums_1.QueueName.MESSAGE_CLEANUP,
            jobName: 'queue-system-cleanup',
            dataFactory: () => ({
                cleanupType: 'system',
                maxAge: 86400000 * 7,
            }),
            options: {
                priority: enums_1.JobPriority.LOW,
            },
            enabled: true,
            description: 'Daily cleanup of old completed and failed jobs',
        });
        this.registerScheduledJob({
            id: 'index-optimization',
            cronExpression: '0 4 * * 0',
            queueName: enums_1.QueueName.MESSAGE_INDEXING,
            jobName: 'optimize-indexes',
            dataFactory: () => ({
                operation: 'optimize',
                batchSize: 1000,
            }),
            options: {
                priority: enums_1.JobPriority.LOW,
            },
            enabled: true,
            description: 'Weekly search index optimization',
        });
        this.registerScheduledJob({
            id: 'message-archive',
            cronExpression: '0 5 * * *',
            queueName: enums_1.QueueName.MESSAGE_CLEANUP,
            jobName: 'archive-old-messages',
            dataFactory: () => ({
                cleanupType: 'archive',
                olderThanDays: 90,
            }),
            options: {
                priority: enums_1.JobPriority.LOW,
            },
            enabled: true,
            description: 'Daily archiving of old messages',
        });
        this.registerScheduledJob({
            id: 'notification-digest',
            cronExpression: '0 9 * * *',
            queueName: enums_1.QueueName.MESSAGE_NOTIFICATION,
            jobName: 'send-daily-digest',
            dataFactory: () => ({
                type: 'daily_digest',
                includeUnread: true,
            }),
            options: {
                priority: enums_1.JobPriority.NORMAL,
            },
            enabled: true,
            description: 'Daily notification digest for users',
        });
    }
    async executeJob(config) {
        if (!config.enabled) {
            this.logDebug(`Skipping disabled scheduled job: ${config.id}`);
            return null;
        }
        try {
            const queueService = this.findQueueServiceForQueue(config.queueName);
            if (!queueService) {
                throw new Error(`No queue service found for queue: ${config.queueName}`);
            }
            const data = config.dataFactory();
            const job = await queueService.addJobToQueue(config.queueName, config.jobName, data, config.options);
            this.recordExecution({
                id: config.id,
                jobId: String(job.id),
                executedAt: new Date(),
                success: true,
            });
            this.logInfo(`Scheduled job executed: ${config.id} -> Job ${job.id}`);
            return job;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.recordExecution({
                id: config.id,
                jobId: 'failed',
                executedAt: new Date(),
                success: false,
                error: errorMessage,
            });
            this.logError(`Scheduled job failed: ${config.id} - ${errorMessage}`);
            return null;
        }
    }
    findQueueServiceForQueue(queueName) {
        for (const service of this.queueServices) {
            try {
                service.getQueueStats(queueName);
                return service;
            }
            catch {
                continue;
            }
        }
        return null;
    }
    recordExecution(execution) {
        this.executionHistory.push(execution);
        if (this.executionHistory.length > 1000) {
            this.executionHistory.splice(0, this.executionHistory.length - 1000);
        }
    }
    async runScheduledJobs() {
        const now = new Date();
        for (const config of this.scheduledJobs.values()) {
            if (!config.enabled)
                continue;
            if (config.cronExpression.includes('0 * * * *') && now.getMinutes() === 0) {
                await this.executeJob(config);
            }
            if (config.cronExpression.includes('0 3 * * *') &&
                now.getHours() === 3 && now.getMinutes() === 0) {
                await this.executeJob(config);
            }
            if (config.cronExpression.includes('0 4 * * 0') &&
                now.getDay() === 0 && now.getHours() === 4 && now.getMinutes() === 0) {
                await this.executeJob(config);
            }
            if (config.cronExpression.includes('0 5 * * *') &&
                now.getHours() === 5 && now.getMinutes() === 0) {
                await this.executeJob(config);
            }
            if (config.cronExpression.includes('0 9 * * *') &&
                now.getHours() === 9 && now.getMinutes() === 0) {
                await this.executeJob(config);
            }
        }
    }
    getSchedulerStats() {
        const jobs = Array.from(this.scheduledJobs.values());
        const enabledJobs = jobs.filter(j => j.enabled).length;
        const recentExecutions = this.executionHistory.filter(e => Date.now() - e.executedAt.getTime() < 86400000);
        const successfulExecutions = recentExecutions.filter(e => e.success).length;
        const successRate = recentExecutions.length > 0
            ? successfulExecutions / recentExecutions.length
            : 0;
        const lastExecution = this.executionHistory.length > 0
            ? this.executionHistory.sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())[0].executedAt
            : null;
        return {
            totalScheduledJobs: jobs.length,
            enabledJobs,
            disabledJobs: jobs.length - enabledJobs,
            recentExecutions: recentExecutions.length,
            successRate,
            lastExecution,
        };
    }
};
exports.QueueSchedulerService = QueueSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueSchedulerService.prototype, "runScheduledJobs", null);
exports.QueueSchedulerService = QueueSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueSchedulerService);
//# sourceMappingURL=queue-scheduler.service.js.map