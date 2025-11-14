"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const email_service_1 = require("./email.service");
const email_template_service_1 = require("./email-template.service");
const email_queue_service_1 = require("./email-queue.service");
const email_rate_limiter_service_1 = require("./email-rate-limiter.service");
const email_validator_service_1 = require("./services/email-validator.service");
const email_sender_service_1 = require("./services/email-sender.service");
const email_statistics_service_1 = require("./services/email-statistics.service");
const appointment_listener_1 = require("./listeners/appointment.listener");
const logger_service_1 = require("../../common/logging/logger.service");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bull_1.BullModule.registerQueueAsync({
                name: email_queue_service_1.EMAIL_QUEUE_NAME,
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                    defaultJobOptions: {
                        attempts: configService.get('EMAIL_QUEUE_MAX_RETRIES', 3) + 1,
                        backoff: {
                            type: 'exponential',
                            delay: configService.get('EMAIL_QUEUE_BACKOFF_DELAY', 5000),
                        },
                        removeOnComplete: {
                            age: 86400,
                            count: 1000,
                        },
                        removeOnFail: {
                            age: 604800,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            email_service_1.EmailService,
            email_template_service_1.EmailTemplateService,
            email_queue_service_1.EmailQueueService,
            email_rate_limiter_service_1.EmailRateLimiterService,
            email_validator_service_1.EmailValidatorService,
            email_sender_service_1.EmailSenderService,
            email_statistics_service_1.EmailStatisticsService,
            logger_service_1.LoggerService,
            appointment_listener_1.AppointmentEmailListener,
        ],
        exports: [email_service_1.EmailService, appointment_listener_1.AppointmentEmailListener],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map