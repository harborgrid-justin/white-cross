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
exports.QueueConfigService = exports.QUEUE_CONFIGS = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("./enums");
exports.QUEUE_CONFIGS = {
    [enums_1.QueueName.MESSAGE_DELIVERY]: {
        name: enums_1.QueueName.MESSAGE_DELIVERY,
        concurrency: 10,
        maxAttempts: 5,
        backoffType: 'exponential',
        backoffDelay: 2000,
        timeout: 30000,
        removeOnCompleteCount: 1000,
        removeOnCompleteAge: 86400,
        removeOnFailCount: 2000,
        removeOnFailAge: 604800,
    },
    [enums_1.QueueName.MESSAGE_NOTIFICATION]: {
        name: enums_1.QueueName.MESSAGE_NOTIFICATION,
        concurrency: 15,
        maxAttempts: 3,
        backoffType: 'exponential',
        backoffDelay: 1000,
        timeout: 20000,
        removeOnCompleteCount: 500,
        removeOnCompleteAge: 43200,
        removeOnFailCount: 1000,
        removeOnFailAge: 259200,
    },
    [enums_1.QueueName.MESSAGE_INDEXING]: {
        name: enums_1.QueueName.MESSAGE_INDEXING,
        concurrency: 3,
        maxAttempts: 3,
        backoffType: 'exponential',
        backoffDelay: 3000,
        timeout: 60000,
        removeOnCompleteCount: 500,
        removeOnCompleteAge: 86400,
        removeOnFailCount: 1000,
        removeOnFailAge: 259200,
    },
    [enums_1.QueueName.MESSAGE_ENCRYPTION]: {
        name: enums_1.QueueName.MESSAGE_ENCRYPTION,
        concurrency: 5,
        maxAttempts: 3,
        backoffType: 'exponential',
        backoffDelay: 2000,
        timeout: 45000,
        removeOnCompleteCount: 500,
        removeOnCompleteAge: 86400,
        removeOnFailCount: 1000,
        removeOnFailAge: 604800,
    },
    [enums_1.QueueName.BATCH_MESSAGE_SENDING]: {
        name: enums_1.QueueName.BATCH_MESSAGE_SENDING,
        concurrency: 2,
        maxAttempts: 3,
        backoffType: 'exponential',
        backoffDelay: 5000,
        timeout: 300000,
        removeOnCompleteCount: 100,
        removeOnCompleteAge: 172800,
        removeOnFailCount: 200,
        removeOnFailAge: 604800,
    },
    [enums_1.QueueName.MESSAGE_CLEANUP]: {
        name: enums_1.QueueName.MESSAGE_CLEANUP,
        concurrency: 1,
        maxAttempts: 2,
        backoffType: 'fixed',
        backoffDelay: 10000,
        timeout: 600000,
        removeOnCompleteCount: 50,
        removeOnCompleteAge: 86400,
        removeOnFailCount: 100,
        removeOnFailAge: 604800,
    },
};
let QueueConfigService = class QueueConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    createSharedConfiguration() {
        return {
            redis: {
                host: this.configService.get('REDIS_HOST', 'localhost'),
                port: this.configService.get('REDIS_PORT', 6379),
                password: this.configService.get('REDIS_PASSWORD'),
                username: this.configService.get('REDIS_USERNAME'),
                db: this.configService.get('REDIS_QUEUE_DB', 0),
                maxRetriesPerRequest: 20,
                enableReadyCheck: true,
                retryStrategy: (times) => {
                    if (times > 10) {
                        return null;
                    }
                    return Math.min(times * 1000, 5000);
                },
            },
            prefix: 'msg-queue',
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: {
                    count: 500,
                    age: 86400,
                },
                removeOnFail: {
                    count: 1000,
                    age: 604800,
                },
            },
        };
    }
    getQueueConfig(queueName) {
        return exports.QUEUE_CONFIGS[queueName];
    }
    getAllQueueConfigs() {
        return exports.QUEUE_CONFIGS;
    }
    getRedisConnectionString() {
        const host = this.configService.get('REDIS_HOST', 'localhost');
        const port = this.configService.get('REDIS_PORT', 6379);
        const db = this.configService.get('REDIS_QUEUE_DB', 0);
        return `redis://${host}:${port}/${db}`;
    }
    isRedisConfigured() {
        const host = this.configService.get('REDIS_HOST');
        const port = this.configService.get('REDIS_PORT');
        return Boolean(host && port);
    }
    getJobOptionsForPriority(priority) {
        return {
            priority,
            attempts: priority >= enums_1.JobPriority.HIGH ? 5 : 3,
            backoff: {
                type: 'exponential',
                delay: priority >= enums_1.JobPriority.HIGH ? 1000 : 2000,
            },
        };
    }
};
exports.QueueConfigService = QueueConfigService;
exports.QueueConfigService = QueueConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueConfigService);
//# sourceMappingURL=queue.config.js.map