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
exports.BaseSmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const dto_1 = require("../dto");
const sms_queue_processor_1 = require("../processors/sms-queue.processor");
let BaseSmsService = class BaseSmsService {
    configService;
    smsQueue;
    logger;
    isProduction;
    maxLength = 160;
    constructor(configService, smsQueue) {
        this.configService = configService;
        this.smsQueue = smsQueue;
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
    }
    validatePhoneNumberFormat(phoneNumber) {
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            throw new common_1.BadRequestException('Phone number is required');
        }
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        if (!e164Regex.test(phoneNumber)) {
            throw new common_1.BadRequestException('Phone number must be in E.164 format (e.g., +15551234567)');
        }
    }
    truncateMessage(message) {
        if (message.length <= this.maxLength) {
            return message;
        }
        return message.substring(0, this.maxLength - 3) + '...';
    }
    mapPriorityToNumber(priority) {
        switch (priority) {
            case dto_1.SmsPriority.URGENT:
                return 1;
            case dto_1.SmsPriority.HIGH:
                return 2;
            case dto_1.SmsPriority.NORMAL:
                return 3;
            case dto_1.SmsPriority.LOW:
                return 4;
            default:
                return 3;
        }
    }
    async queueSms(to, message, priority, metadata, maxRetries = 3, delay) {
        const jobData = {
            to,
            message,
            priority,
            attemptNumber: 1,
            maxRetries,
            metadata,
        };
        const bullPriority = this.mapPriorityToNumber(priority);
        const jobOptions = {
            priority: bullPriority,
            attempts: maxRetries,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: 100,
            removeOnFail: 1000,
        };
        if (delay) {
            jobOptions.delay = delay;
        }
        await this.smsQueue.add(sms_queue_processor_1.SmsJobType.SEND_SMS, jobData, jobOptions);
        this.logger.debug(`SMS job queued for ${to} with priority ${priority}`);
    }
    async logSmsToConsole(to, message) {
        this.logger.log('========== SMS ==========');
        this.logger.log(`To: ${to}`);
        this.logger.log(`Message: ${message}`);
        this.logger.log(`Length: ${message.length} chars`);
        this.logger.log('=========================');
        await this.simulateDelay(100);
    }
    simulateDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    createRateLimitException(message, resetInSeconds) {
        return new common_1.HttpException({
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
            message,
            details: { resetInSeconds },
        }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
};
exports.BaseSmsService = BaseSmsService;
exports.BaseSmsService = BaseSmsService = __decorate([
    __param(1, (0, bull_1.InjectQueue)(sms_queue_processor_1.SMS_QUEUE_NAME)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_1.Queue])
], BaseSmsService);
//# sourceMappingURL=base-sms.service.js.map