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
exports.BaseQueueService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
const queue_config_1 = require("../queue.config");
let BaseQueueService = class BaseQueueService {
    queueConfig;
    logger;
    queues = new Map();
    constructor(queueConfig, serviceName) {
        this.queueConfig = queueConfig;
        this.logger = new common_1.Logger(serviceName);
    }
    onModuleInit() {
        this.logger.log(`${this.constructor.name} initialized`);
        this.logger.log(`Redis: ${this.queueConfig.getRedisConnectionString()}`);
        this.logQueueConfigurations();
    }
    async onModuleDestroy() {
        this.logger.log(`Shutting down ${this.constructor.name}...`);
        await this.closeAllQueues();
    }
    registerQueue(queueName, queue) {
        this.queues.set(queueName, queue);
    }
    getQueue(queueName) {
        const queue = this.queues.get(queueName);
        if (!queue) {
            throw new Error(`Queue ${queueName} not registered`);
        }
        return queue;
    }
    getRegisteredQueueNames() {
        return Array.from(this.queues.keys());
    }
    logQueueConfigurations() {
        const configs = this.queueConfig.getAllQueueConfigs();
        this.getRegisteredQueueNames().forEach((queueName) => {
            const config = configs[queueName];
            if (config) {
                this.logger.log(`Queue [${config.name}]: concurrency=${config.concurrency}, ` +
                    `maxAttempts=${config.maxAttempts}, timeout=${config.timeout}ms`);
            }
        });
    }
    async addJobToQueue(queueName, jobName, data, options) {
        const queue = this.getQueue(queueName);
        const jobOptions = this.buildJobOptions(queueName, options);
        const job = await queue.add(jobName, data, jobOptions);
        this.logger.log(`Job added to ${queueName}: ${job.id} (${jobName}) - Priority: ${jobOptions.priority}`);
        return job;
    }
    async addBatchJobsToQueue(queueName, jobs) {
        const queue = this.getQueue(queueName);
        const bullJobs = jobs.map(({ name, data, options }) => ({
            name,
            data,
            opts: this.buildJobOptions(queueName, options),
        }));
        const createdJobs = await queue.addBulk(bullJobs);
        this.logger.log(`Batch jobs added to ${queueName}: ${createdJobs.length} jobs`);
        return createdJobs;
    }
    buildJobOptions(queueName, options) {
        const config = this.queueConfig.getQueueConfig(queueName);
        const priorityOptions = options?.priority
            ? this.queueConfig.getJobOptionsForPriority(options.priority)
            : { attempts: undefined, backoff: undefined };
        return {
            priority: options?.priority || enums_1.JobPriority.NORMAL,
            delay: options?.delay || 0,
            attempts: options?.attempts ||
                priorityOptions.attempts ||
                config.maxAttempts,
            timeout: options?.timeout || config.timeout,
            backoff: options?.backoff ||
                priorityOptions.backoff || {
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
        const queueStats = await Promise.all(this.getRegisteredQueueNames().map((queueName) => this.getQueueStats(queueName)));
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
        catch {
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
            jobId: String(job.id || 'unknown'),
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
        this.logger.warn(`Queue paused: ${queueName}`);
    }
    async resumeQueue(queueName) {
        const queue = this.getQueue(queueName);
        await queue.resume();
        this.logger.log(`Queue resumed: ${queueName}`);
    }
    async cleanQueue(queueName, grace = 86400000) {
        const queue = this.getQueue(queueName);
        await queue.clean(grace, 'completed');
        await queue.clean(grace * 7, 'failed');
        this.logger.log(`Queue cleaned: ${queueName}`);
    }
    async retryFailedJob(queueName, jobId) {
        const queue = this.getQueue(queueName);
        const job = await queue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found in queue ${queueName}`);
        }
        await job.retry();
        this.logger.log(`Job retried: ${jobId} in queue ${queueName}`);
    }
    async removeJob(queueName, jobId) {
        const queue = this.getQueue(queueName);
        const job = await queue.getJob(jobId);
        if (!job) {
            throw new Error(`Job ${jobId} not found in queue ${queueName}`);
        }
        await job.remove();
        this.logger.log(`Job removed: ${jobId} from queue ${queueName}`);
    }
    async getJob(queueName, jobId) {
        const queue = this.getQueue(queueName);
        return queue.getJob(jobId);
    }
    async getJobsByStatus(queueName, status, start = 0, end = 99) {
        const queue = this.getQueue(queueName);
        switch (status) {
            case 'waiting':
                return queue.getWaiting(start, end);
            case 'active':
                return queue.getActive(start, end);
            case 'completed':
                return queue.getCompleted(start, end);
            case 'failed':
                return queue.getFailed(start, end);
            case 'delayed':
                return queue.getDelayed(start, end);
            default:
                throw new Error(`Unknown job status: ${status}`);
        }
    }
    async closeAllQueues() {
        const closePromises = Array.from(this.queues.values()).map((queue) => queue.close());
        await Promise.all(closePromises);
        this.logger.log('All queues closed');
    }
};
exports.BaseQueueService = BaseQueueService;
exports.BaseQueueService = BaseQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [queue_config_1.QueueConfigService, String])
], BaseQueueService);
//# sourceMappingURL=base-queue.service.js.map