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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const twilio_provider_1 = require("./providers/twilio.provider");
const phone_validator_service_1 = require("./services/phone-validator.service");
const sms_template_service_1 = require("./services/sms-template.service");
const rate_limiter_service_1 = require("./services/rate-limiter.service");
const cost_tracker_service_1 = require("./services/cost-tracker.service");
const sms_queue_processor_1 = require("./processors/sms-queue.processor");
const sms_sender_service_1 = require("./services/sms-sender.service");
const base_1 = require("../../common/base");
let SmsService = class SmsService extends base_1.BaseService {
    configService;
    twilioProvider;
    phoneValidator;
    templateService;
    rateLimiter;
    costTracker;
    smsQueue;
    smsSender;
    isProduction;
    maxLength = 160;
    constructor(configService, twilioProvider, phoneValidator, templateService, rateLimiter, costTracker, smsQueue, smsSender) {
        super("SmsService");
        this.configService = configService;
        this.twilioProvider = twilioProvider;
        this.phoneValidator = phoneValidator;
        this.templateService = templateService;
        this.rateLimiter = rateLimiter;
        this.costTracker = costTracker;
        this.smsQueue = smsQueue;
        this.smsSender = smsSender;
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
        this.logInfo(`SMS Service initialized - Environment: ${this.isProduction ? 'production' : 'development'}`);
        if (this.twilioProvider.isReady()) {
            this.logInfo('Twilio provider is configured and ready');
        }
        else {
            this.logWarning('Twilio provider is not configured - SMS will be logged only');
        }
    }
    async sendAlertSMS(to, data) {
        return this.smsSender.sendAlertSMS(to, data);
    }
    async sendSMS(to, data) {
        return this.smsSender.sendSMS(to, data);
    }
    async sendAdvancedSMS(to, data) {
        return this.smsSender.sendAdvancedSMS(to, data);
    }
    async sendTemplatedSMS(to, data) {
        return this.smsSender.sendTemplatedSMS(to, data);
    }
    async sendBulkSMS(data) {
        return this.smsSender.sendBulkSMS(data);
    }
    async validatePhoneNumber(phoneNumber, defaultCountry) {
        return this.phoneValidator.validatePhoneNumber(phoneNumber, defaultCountry);
    }
    async testConnection(to) {
        try {
            this.logInfo(`Testing SMS connection to ${to}`);
            const validation = await this.phoneValidator.validatePhoneNumber(to);
            if (!validation.isValid) {
                this.logError(`Test failed: Invalid phone number - ${validation.error}`);
                return false;
            }
            await this.sendSMS(validation.e164Format, {
                message: 'White Cross SMS Service Test: This is a test message.',
            });
            this.logInfo('SMS test successful');
            return true;
        }
        catch (error) {
            this.logError('SMS test failed:', error);
            return false;
        }
    }
    getMaxLength() {
        return this.maxLength;
    }
    setMaxLength(length) {
        if (length < 1 || length > 1600) {
            throw new common_1.BadRequestException('SMS length must be between 1 and 1600 characters');
        }
        this.maxLength = length;
        this.logInfo(`SMS max length updated to ${length} characters`);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(6, (0, bull_1.InjectQueue)(sms_queue_processor_1.SMS_QUEUE_NAME)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        twilio_provider_1.TwilioProvider,
        phone_validator_service_1.PhoneValidatorService,
        sms_template_service_1.SmsTemplateService,
        rate_limiter_service_1.RateLimiterService,
        cost_tracker_service_1.CostTrackerService,
        bullmq_1.Queue,
        sms_sender_service_1.SmsSenderService])
], SmsService);
//# sourceMappingURL=sms.service.js.map