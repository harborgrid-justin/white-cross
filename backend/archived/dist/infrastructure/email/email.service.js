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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const email_validator_service_1 = require("./services/email-validator.service");
const email_sender_service_1 = require("./services/email-sender.service");
const email_statistics_service_1 = require("./services/email-statistics.service");
const email_queue_service_1 = require("./email-queue.service");
const email_rate_limiter_service_1 = require("./email-rate-limiter.service");
let EmailService = class EmailService extends base_1.BaseService {
    configService;
    validatorService;
    senderService;
    statisticsService;
    queueService;
    rateLimiterService;
    queueEnabled;
    isProduction;
    constructor(logger, configService, validatorService, senderService, statisticsService, queueService, rateLimiterService) {
        super({
            serviceName: 'EmailService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.validatorService = validatorService;
        this.senderService = senderService;
        this.statisticsService = statisticsService;
        this.queueService = queueService;
        this.rateLimiterService = rateLimiterService;
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
        this.queueEnabled = this.configService.get('EMAIL_QUEUE_ENABLED', true);
        this.logInfo('EmailService initialized');
    }
    async sendAlertEmail(to, data) {
        this.logInfo(`Sending alert email to ${to}: [${data.severity}] ${data.title}`);
        const validation = this.validatorService.validateEmail(to);
        if (!validation.valid) {
            throw new Error(`Invalid email address: ${validation.reason}`);
        }
        const alertData = {
            severity: data.severity,
            category: data.category,
            alertId: data.alertId,
            timestamp: data.timestamp || new Date(),
            title: data.title,
            message: data.message,
        };
        return this.senderService.sendAlertEmail([to], `[${data.severity}] ${data.title}`, alertData);
    }
    async sendEmail(to, data) {
        this.logInfo(`Sending email to ${to}: ${data.subject}`);
        return this.senderService.sendGenericEmail([to], data.subject, data.body, data.html);
    }
    async sendTemplatedEmail(emailData) {
        return this.senderService.sendTemplatedEmail(emailData);
    }
    async sendBulkEmail(recipients, data) {
        this.logInfo(`Sending bulk email to ${recipients.length} recipients`);
        const validationSummary = this.validatorService.getValidationSummary(recipients);
        if (validationSummary.invalid > 0) {
            this.logWarning(`${validationSummary.invalid} invalid emails found, filtering them out`);
        }
        const validRecipients = validationSummary.validEmails;
        const batchSize = 50;
        const batches = [];
        for (let i = 0; i < validRecipients.length; i += batchSize) {
            batches.push(validRecipients.slice(i, i + batchSize));
        }
        const results = [];
        for (const batch of batches) {
            const batchResults = await Promise.all(batch.map((recipient) => this.senderService.sendGenericEmail([recipient], data.subject, data.body, data.html)
                .catch((error) => ({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date(),
                recipients: [recipient],
            }))));
            results.push(...batchResults);
        }
        return results;
    }
    async sendBatchEmails(emails) {
        this.logInfo(`Sending batch of ${emails.length} personalized emails`);
        const promises = emails.map(({ to, data }) => this.sendEmail(to, data).catch((error) => ({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date(),
            recipients: [to],
        })));
        return Promise.all(promises);
    }
    async testConnection(to) {
        return this.senderService.testConnection(to);
    }
    validateEmail(email) {
        return this.validatorService.validateEmail(email);
    }
    getStatistics() {
        return this.statisticsService.getStatistics();
    }
    async close() {
        await this.senderService.close();
        this.logInfo('Email service closed');
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        email_validator_service_1.EmailValidatorService,
        email_sender_service_1.EmailSenderService,
        email_statistics_service_1.EmailStatisticsService,
        email_queue_service_1.EmailQueueService,
        email_rate_limiter_service_1.EmailRateLimiterService])
], EmailService);
//# sourceMappingURL=email.service.js.map