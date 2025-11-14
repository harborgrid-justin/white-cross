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
exports.QueueManagerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const job_type_enum_1 = require("../enums/job-type.enum");
let QueueManagerService = class QueueManagerService extends base_1.BaseService {
    configService;
    queues = new Map();
    constructor(logger, configService) {
        super({
            serviceName: 'QueueManagerService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            const redisPassword = this.configService.get('REDIS_PASSWORD');
            this.logInfo(`Queue manager initialized with Redis at ${redisHost}:${redisPort}`);
            await this.initializeScheduledJobs();
        }
        catch (error) {
            this.logError('Failed to initialize queue manager', error);
            throw error;
        }
    }
    async initializeScheduledJobs() {
        try {
            await this.scheduleJob(job_type_enum_1.JobType.MEDICATION_REMINDER, {}, '0 0,6 * * *', 'medication-reminder-scheduled');
            this.logInfo('Medication reminders job scheduled (0 0,6 * * *)');
            await this.scheduleJob(job_type_enum_1.JobType.INVENTORY_MAINTENANCE, {}, '*/15 * * * *', 'inventory-maintenance-scheduled');
            this.logInfo('Inventory maintenance job scheduled (*/15 * * * *)');
            this.logInfo('All scheduled jobs initialized successfully');
        }
        catch (error) {
            this.logError('Failed to initialize scheduled jobs', error);
        }
    }
    async onModuleDestroy() {
        await this.shutdown();
    }
    getQueue(jobType) {
        if (this.queues.has(jobType)) {
            return this.queues.get(jobType);
        }
        const redisConfig = {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD'),
            maxRetriesPerRequest: null,
        };
        const queue = new bullmq_1.Queue(jobType, {
            connection: redisConfig,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: {
                    count: 100,
                    age: 24 * 3600,
                },
                removeOnFail: {
                    count: 1000,
                    age: 7 * 24 * 3600,
                },
            },
        });
        this.queues.set(jobType, queue);
        this.logInfo(`Queue created: ${jobType}`);
        return queue;
    }
    async addJob(jobType, data, options) {
        const queue = this.getQueue(jobType);
        const job = await queue.add(jobType, data, {
            delay: options?.delay,
            priority: options?.priority,
            repeat: options?.repeat,
            jobId: options?.jobId,
        });
        this.logInfo(`Job added to ${jobType} queue`, {
            jobId: job.id,
            options,
        });
        return job;
    }
    async scheduleJob(jobType, data, cronPattern, jobId) {
        return this.addJob(jobType, data, {
            repeat: {
                pattern: cronPattern,
            },
            jobId: jobId || `${jobType}-scheduled`,
        });
    }
    async getJob(jobType, jobId) {
        const queue = this.queues.get(jobType);
        if (!queue) {
            return undefined;
        }
        return queue.getJob(jobId);
    }
    async getQueueStats(jobType) {
        const queue = this.queues.get(jobType);
        if (!queue) {
            return {
                waiting: 0,
                active: 0,
                completed: 0,
                failed: 0,
                delayed: 0,
            };
        }
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
        ]);
        return {
            waiting,
            active,
            completed,
            failed,
            delayed,
        };
    }
    async getAllQueueStats() {
        const stats = {};
        for (const jobType of this.queues.keys()) {
            stats[jobType] = await this.getQueueStats(jobType);
        }
        return stats;
    }
    async pauseQueue(jobType) {
        const queue = this.queues.get(jobType);
        if (queue) {
            await queue.pause();
            this.logInfo(`Queue ${jobType} paused`);
        }
    }
    async resumeQueue(jobType) {
        const queue = this.queues.get(jobType);
        if (queue) {
            await queue.resume();
            this.logInfo(`Queue ${jobType} resumed`);
        }
    }
    async cleanQueue(jobType, grace = 24 * 3600 * 1000) {
        const queue = this.queues.get(jobType);
        if (queue) {
            await queue.clean(grace, 100, 'completed');
            await queue.clean(grace * 7, 100, 'failed');
            this.logInfo(`Queue ${jobType} cleaned`);
        }
    }
    async shutdown() {
        this.logInfo('Shutting down queue manager...');
        for (const [jobType, queue] of this.queues.entries()) {
            await queue.close();
            this.logInfo(`Queue closed: ${jobType}`);
        }
        this.queues.clear();
        this.logInfo('Queue manager shutdown complete');
    }
};
exports.QueueManagerService = QueueManagerService;
exports.QueueManagerService = QueueManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], QueueManagerService);
//# sourceMappingURL=queue-manager.service.js.map