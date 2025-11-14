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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TwilioProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioProvider = exports.TwilioErrorCode = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = __importDefault(require("twilio"));
const sms_queue_job_dto_1 = require("../dto/sms-queue-job.dto");
var TwilioErrorCode;
(function (TwilioErrorCode) {
    TwilioErrorCode["INVALID_PHONE_NUMBER"] = "21211";
    TwilioErrorCode["UNVERIFIED_NUMBER"] = "21408";
    TwilioErrorCode["INVALID_FROM_NUMBER"] = "21606";
    TwilioErrorCode["RATE_LIMIT_EXCEEDED"] = "20429";
    TwilioErrorCode["INSUFFICIENT_FUNDS"] = "20003";
    TwilioErrorCode["UNREACHABLE_CARRIER"] = "30003";
    TwilioErrorCode["UNREACHABLE_DESTINATION"] = "30005";
    TwilioErrorCode["LANDLINE_UNREACHABLE"] = "30006";
    TwilioErrorCode["SPAM_DETECTED"] = "30007";
    TwilioErrorCode["UNKNOWN_ERROR"] = "30008";
})(TwilioErrorCode || (exports.TwilioErrorCode = TwilioErrorCode = {}));
let TwilioProvider = TwilioProvider_1 = class TwilioProvider {
    configService;
    logger = new common_1.Logger(TwilioProvider_1.name);
    client = null;
    config;
    isConfigured;
    COST_PER_SEGMENT_US = 0.0079;
    COST_PER_SEGMENT_CA = 0.0075;
    COST_PER_SEGMENT_INTL = 0.045;
    constructor(configService) {
        this.configService = configService;
        this.config = {
            accountSid: this.configService.get('TWILIO_ACCOUNT_SID', ''),
            authToken: this.configService.get('TWILIO_AUTH_TOKEN', ''),
            fromNumber: this.configService.get('TWILIO_FROM_NUMBER', ''),
            statusCallbackUrl: this.configService.get('TWILIO_STATUS_CALLBACK_URL'),
        };
        this.isConfigured = !!(this.config.accountSid &&
            this.config.authToken &&
            this.config.fromNumber);
        if (this.isConfigured) {
            try {
                this.client = (0, twilio_1.default)(this.config.accountSid, this.config.authToken);
                this.logger.log('Twilio provider initialized successfully');
            }
            catch (error) {
                this.logger.error(`Failed to initialize Twilio client: ${error.message}`);
            }
        }
        else {
            this.logger.warn('Twilio provider not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER environment variables.');
        }
    }
    isReady() {
        return this.isConfigured && this.client !== null;
    }
    async sendSms(to, message, metadata) {
        if (!this.isReady()) {
            throw new Error('Twilio provider is not configured');
        }
        const startTime = Date.now();
        try {
            this.logger.debug(`Sending SMS to ${to} via Twilio`);
            const messageOptions = {
                body: message,
                from: this.config.fromNumber,
                to: to,
            };
            if (this.config.statusCallbackUrl) {
                messageOptions.statusCallback = this.config.statusCallbackUrl;
            }
            const twilioMessage = await this.client.messages.create(messageOptions);
            const segmentCount = twilioMessage.numSegments
                ? parseInt(twilioMessage.numSegments)
                : 1;
            const cost = this.calculateCost(to, segmentCount);
            const result = {
                status: this.mapTwilioStatus(twilioMessage.status),
                messageId: twilioMessage.sid,
                to: twilioMessage.to,
                segmentCount: segmentCount,
                cost: cost,
                timestamp: new Date().toISOString(),
            };
            const duration = Date.now() - startTime;
            this.logger.log(`SMS sent successfully to ${to} (${segmentCount} segments, $${cost.toFixed(4)}, ${duration}ms)`);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Twilio SMS failed to ${to} (${duration}ms): ${error.message}`);
            return {
                status: sms_queue_job_dto_1.SmsDeliveryStatus.FAILED,
                to: to,
                segmentCount: 1,
                cost: 0,
                timestamp: new Date().toISOString(),
                error: error.message,
                errorCode: error.code || TwilioErrorCode.UNKNOWN_ERROR,
            };
        }
    }
    async getMessageStatus(messageId) {
        if (!this.isReady()) {
            throw new Error('Twilio provider is not configured');
        }
        try {
            const message = await this.client.messages(messageId).fetch();
            const segmentCount = message.numSegments
                ? parseInt(message.numSegments)
                : 1;
            const cost = this.calculateCost(message.to, segmentCount);
            return {
                status: this.mapTwilioStatus(message.status),
                messageId: message.sid,
                to: message.to,
                segmentCount: segmentCount,
                cost: cost,
                timestamp: message.dateUpdated?.toISOString() || new Date().toISOString(),
                error: message.errorMessage || undefined,
                errorCode: message.errorCode?.toString() || undefined,
            };
        }
        catch (error) {
            this.logger.error(`Failed to fetch message status for ${messageId}: ${error.message}`);
            throw error;
        }
    }
    async handleStatusWebhook(webhookData) {
        try {
            const segmentCount = parseInt(webhookData.NumSegments) || 1;
            const cost = this.calculateCost(webhookData.To, segmentCount);
            return {
                status: this.mapTwilioStatus(webhookData.MessageStatus || webhookData.SmsStatus),
                messageId: webhookData.MessageSid || webhookData.SmsSid,
                to: webhookData.To,
                segmentCount: segmentCount,
                cost: cost,
                timestamp: new Date().toISOString(),
                error: webhookData.ErrorMessage || undefined,
                errorCode: webhookData.ErrorCode || undefined,
            };
        }
        catch (error) {
            this.logger.error(`Failed to process Twilio webhook: ${error.message}`);
            throw error;
        }
    }
    isRetryableError(errorCode) {
        const retryableCodes = [
            TwilioErrorCode.RATE_LIMIT_EXCEEDED,
            TwilioErrorCode.UNREACHABLE_CARRIER,
            TwilioErrorCode.UNKNOWN_ERROR,
        ];
        return retryableCodes.includes(errorCode);
    }
    getRetryDelay(errorCode, attemptNumber) {
        if (errorCode === TwilioErrorCode.RATE_LIMIT_EXCEEDED) {
            return Math.min(60000 * attemptNumber, 300000);
        }
        return Math.min(1000 * Math.pow(2, attemptNumber), 30000);
    }
    mapTwilioStatus(twilioStatus) {
        switch (twilioStatus?.toLowerCase()) {
            case 'queued':
            case 'accepted':
                return sms_queue_job_dto_1.SmsDeliveryStatus.QUEUED;
            case 'sending':
            case 'sent':
                return sms_queue_job_dto_1.SmsDeliveryStatus.SENT;
            case 'delivered':
                return sms_queue_job_dto_1.SmsDeliveryStatus.DELIVERED;
            case 'failed':
                return sms_queue_job_dto_1.SmsDeliveryStatus.FAILED;
            case 'undelivered':
                return sms_queue_job_dto_1.SmsDeliveryStatus.UNDELIVERED;
            default:
                return sms_queue_job_dto_1.SmsDeliveryStatus.QUEUED;
        }
    }
    calculateCost(to, segmentCount) {
        let costPerSegment = this.COST_PER_SEGMENT_INTL;
        if (to.startsWith('+1')) {
            costPerSegment = to.substring(2, 5).startsWith('1')
                ? this.COST_PER_SEGMENT_CA
                : this.COST_PER_SEGMENT_US;
        }
        return costPerSegment * segmentCount;
    }
};
exports.TwilioProvider = TwilioProvider;
exports.TwilioProvider = TwilioProvider = TwilioProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TwilioProvider);
//# sourceMappingURL=twilio.provider.js.map