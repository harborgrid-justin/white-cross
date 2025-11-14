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
var SmsSenderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsSenderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const twilio_provider_1 = require("../providers/twilio.provider");
const phone_validator_service_1 = require("./phone-validator.service");
const rate_limiter_service_1 = require("./rate-limiter.service");
const base_sms_service_1 = require("../base/base-sms.service");
const dto_1 = require("../dto");
const sms_template_service_1 = require("./sms-template.service");
const sms_queue_processor_1 = require("../processors/sms-queue.processor");
let SmsSenderService = SmsSenderService_1 = class SmsSenderService extends base_sms_service_1.BaseSmsService {
    twilioProvider;
    phoneValidator;
    rateLimiter;
    templateService;
    logger;
    constructor(configService, smsQueue, twilioProvider, phoneValidator, rateLimiter, templateService) {
        super(configService, smsQueue);
        this.twilioProvider = twilioProvider;
        this.phoneValidator = phoneValidator;
        this.rateLimiter = rateLimiter;
        this.templateService = templateService;
        this.logger = new common_1.Logger(SmsSenderService_1.name);
    }
    async sendAlertSMS(to, data) {
        this.logInfo(`Sending alert SMS to ${to} - [${data.severity}] ${data.title}`);
        try {
            const validation = await this.phoneValidator.validatePhoneNumber(to);
            if (!validation.isValid) {
                throw new Error(`Invalid phone number: ${validation.error}`);
            }
            const normalizedPhone = validation.e164Format;
            await this.checkRateLimits(normalizedPhone);
            const formattedMessage = this.formatAlertSMS(data);
            const truncatedMessage = this.truncateMessage(formattedMessage);
            const priority = this.mapSeverityToPriority(data.severity);
            if (this.twilioProvider.isReady() && this.isProduction) {
                await this.queueSms(normalizedPhone, truncatedMessage, priority, {
                    alertTitle: data.title,
                    alertSeverity: data.severity,
                    type: 'alert',
                });
            }
            else {
                await this.logSmsToConsole(normalizedPhone, truncatedMessage);
            }
            await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
            await this.rateLimiter.incrementAccount('default');
            this.logInfo(`Alert SMS queued successfully for ${normalizedPhone}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logError(`Failed to send alert SMS to ${to}: ${errorMessage}`);
            throw error;
        }
    }
    async sendSMS(to, data) {
        this.logInfo(`Sending SMS to ${to}`);
        try {
            const validation = await this.phoneValidator.validatePhoneNumber(to);
            if (!validation.isValid) {
                throw new Error(`Invalid phone number: ${validation.error}`);
            }
            const normalizedPhone = validation.e164Format;
            await this.checkRateLimits(normalizedPhone);
            const truncatedMessage = this.truncateMessage(data.message);
            if (this.twilioProvider.isReady() && this.isProduction) {
                await this.queueSms(normalizedPhone, truncatedMessage, dto_1.SmsPriority.NORMAL, {
                    type: 'generic',
                });
            }
            else {
                await this.logSmsToConsole(normalizedPhone, truncatedMessage);
            }
            await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
            await this.rateLimiter.incrementAccount('default');
            this.logInfo(`SMS sent successfully to ${normalizedPhone}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logError(`Failed to send SMS to ${to}: ${errorMessage}`);
            throw error;
        }
    }
    async sendAdvancedSMS(to, data) {
        this.logInfo(`Sending advanced SMS to ${to} with priority ${data.priority}`);
        try {
            const validation = await this.phoneValidator.validatePhoneNumber(to);
            if (!validation.isValid) {
                throw new Error(`Invalid phone number: ${validation.error}`);
            }
            const normalizedPhone = validation.e164Format;
            await this.checkRateLimits(normalizedPhone);
            let message = data.message;
            if (data.templateVariables) {
                Object.entries(data.templateVariables).forEach(([key, value]) => {
                    message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
                });
            }
            const truncatedMessage = this.truncateMessage(message);
            if (this.twilioProvider.isReady() && this.isProduction) {
                const delay = data.scheduledFor ? new Date(data.scheduledFor).getTime() - Date.now() : 0;
                await this.queueSms(normalizedPhone, truncatedMessage, data.priority || dto_1.SmsPriority.NORMAL, data.metadata, data.maxRetries, delay > 0 ? delay : undefined);
            }
            else {
                await this.logSmsToConsole(normalizedPhone, truncatedMessage);
            }
            await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
            await this.rateLimiter.incrementAccount('default');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logError(`Failed to send advanced SMS to ${to}: ${errorMessage}`);
            throw error;
        }
    }
    async sendTemplatedSMS(to, data) {
        this.logInfo(`Sending templated SMS (${data.templateId}) to ${to}`);
        try {
            const validation = await this.phoneValidator.validatePhoneNumber(to);
            if (!validation.isValid) {
                throw new Error(`Invalid phone number: ${validation.error}`);
            }
            const normalizedPhone = validation.e164Format;
            await this.checkRateLimits(normalizedPhone);
            const message = await this.templateService.renderTemplate(data.templateId, data.variables);
            const truncatedMessage = this.truncateMessage(message);
            if (this.twilioProvider.isReady() && this.isProduction) {
                await this.queueSms(normalizedPhone, truncatedMessage, dto_1.SmsPriority.NORMAL, {
                    templateId: data.templateId,
                    type: 'templated',
                });
            }
            else {
                await this.logSmsToConsole(normalizedPhone, truncatedMessage);
            }
            await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logError(`Failed to send templated SMS to ${to}: ${errorMessage}`);
            throw error;
        }
    }
    async sendBulkSMS(data) {
        this.logInfo(`Sending bulk SMS to ${data.recipients.length} recipients`);
        const results = [];
        let successCount = 0;
        let estimatedCost = 0;
        for (const recipient of data.recipients) {
            try {
                const validation = await this.phoneValidator.validatePhoneNumber(recipient);
                if (!validation.isValid) {
                    results.push({ phoneNumber: recipient, error: validation.error });
                    continue;
                }
                const normalizedPhone = validation.e164Format;
                const rateLimitStatus = await this.rateLimiter.checkPhoneNumberLimit(normalizedPhone);
                if (rateLimitStatus.isLimited) {
                    results.push({
                        phoneNumber: recipient,
                        error: `Rate limit exceeded. Resets in ${rateLimitStatus.resetInSeconds}s`,
                    });
                    continue;
                }
                const truncatedMessage = this.truncateMessage(data.message);
                if (this.twilioProvider.isReady() && this.isProduction) {
                    await this.queueSms(normalizedPhone, truncatedMessage, data.priority || dto_1.SmsPriority.NORMAL, { ...data.metadata, bulkSend: true });
                }
                else {
                    await this.logSmsToConsole(normalizedPhone, truncatedMessage);
                }
                await this.rateLimiter.incrementPhoneNumber(normalizedPhone);
                await this.rateLimiter.incrementAccount('default');
                successCount++;
                estimatedCost += 0.0079;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                results.push({ phoneNumber: recipient, error: errorMessage });
            }
        }
        const failedCount = data.recipients.length - successCount;
        const failures = results
            .filter((r) => r.error)
            .map((r) => ({ phoneNumber: r.phoneNumber, error: r.error }));
        this.logInfo(`Bulk SMS completed - ${successCount} successful, ${failedCount} failed`);
        return {
            totalRecipients: data.recipients.length,
            successCount,
            failedCount,
            failures,
            estimatedCost: parseFloat(estimatedCost.toFixed(4)),
            timestamp: new Date().toISOString(),
        };
    }
    async checkRateLimits(phoneNumber) {
        const phoneLimit = await this.rateLimiter.checkPhoneNumberLimit(phoneNumber);
        if (phoneLimit.isLimited) {
            this.logWarning(`Rate limit exceeded for ${String(phoneNumber)}`);
            throw this.createRateLimitException(`Rate limit exceeded for this phone number. Try again in ${phoneLimit.resetInSeconds} seconds.`, phoneLimit.resetInSeconds);
        }
        const accountLimit = await this.rateLimiter.checkAccountLimit('default');
        if (accountLimit.isLimited) {
            this.logWarning('Account rate limit exceeded');
            throw this.createRateLimitException(`Account SMS rate limit exceeded. Try again in ${accountLimit.resetInSeconds} seconds.`, accountLimit.resetInSeconds);
        }
    }
    formatAlertSMS(data) {
        return `[${data.severity}] ${data.title}: ${data.message}`;
    }
    mapSeverityToPriority(severity) {
        switch (severity.toLowerCase()) {
            case 'critical':
            case 'emergency':
                return dto_1.SmsPriority.URGENT;
            case 'high':
                return dto_1.SmsPriority.HIGH;
            case 'medium':
                return dto_1.SmsPriority.NORMAL;
            case 'low':
                return dto_1.SmsPriority.LOW;
            default:
                return dto_1.SmsPriority.NORMAL;
        }
    }
};
exports.SmsSenderService = SmsSenderService;
exports.SmsSenderService = SmsSenderService = SmsSenderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)(sms_queue_processor_1.SMS_QUEUE_NAME)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bullmq_1.Queue,
        twilio_provider_1.TwilioProvider,
        phone_validator_service_1.PhoneValidatorService,
        rate_limiter_service_1.RateLimiterService,
        sms_template_service_1.SmsTemplateService])
], SmsSenderService);
//# sourceMappingURL=sms-sender.service.js.map