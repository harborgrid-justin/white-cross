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
var SmsQueueProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsQueueProcessor = exports.SmsJobType = exports.SMS_QUEUE_NAME = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const twilio_provider_1 = require("../providers/twilio.provider");
const sms_queue_job_dto_1 = require("../dto/sms-queue-job.dto");
exports.SMS_QUEUE_NAME = 'sms-delivery';
var SmsJobType;
(function (SmsJobType) {
    SmsJobType["SEND_SMS"] = "send-sms";
    SmsJobType["SEND_BULK"] = "send-bulk";
    SmsJobType["CHECK_STATUS"] = "check-status";
})(SmsJobType || (exports.SmsJobType = SmsJobType = {}));
let SmsQueueProcessor = SmsQueueProcessor_1 = class SmsQueueProcessor {
    twilioProvider;
    logger = new common_1.Logger(SmsQueueProcessor_1.name);
    constructor(twilioProvider) {
        this.twilioProvider = twilioProvider;
    }
    async handleSendSms(job) {
        const { to, message, attemptNumber, maxRetries, metadata } = job.data;
        this.logger.log(`Processing SMS job ${job.id} - Attempt ${attemptNumber}/${maxRetries} to ${to}`);
        try {
            if (!this.twilioProvider.isReady()) {
                throw new Error('Twilio provider is not configured');
            }
            const result = await this.twilioProvider.sendSms(to, message, metadata);
            if (result.status === sms_queue_job_dto_1.SmsDeliveryStatus.FAILED &&
                attemptNumber < maxRetries) {
                const isRetryable = result.errorCode
                    ? this.twilioProvider.isRetryableError(result.errorCode)
                    : true;
                if (isRetryable) {
                    const retryDelay = result.errorCode
                        ? this.twilioProvider.getRetryDelay(result.errorCode, attemptNumber)
                        : this.getExponentialBackoff(attemptNumber);
                    this.logger.warn(`SMS job ${job.id} failed (attempt ${attemptNumber}/${maxRetries}). Retrying in ${retryDelay}ms`);
                    throw new Error(`SMS delivery failed: ${result.error}. Will retry in ${retryDelay}ms`);
                }
                else {
                    this.logger.error(`SMS job ${job.id} failed with non-retryable error: ${result.error} (${result.errorCode})`);
                    throw new Error(`Non-retryable error: ${result.error}`);
                }
            }
            if (result.status === sms_queue_job_dto_1.SmsDeliveryStatus.FAILED) {
                this.logger.error(`SMS job ${job.id} failed permanently after ${attemptNumber} attempts: ${result.error}`);
            }
            else {
                this.logger.log(`SMS job ${job.id} completed successfully - Status: ${result.status}, Cost: $${result.cost}`);
            }
            await job.progress(100);
            return result;
        }
        catch (error) {
            this.logger.error(`SMS job ${job.id} error: ${error.message}`);
            const progressPercent = Math.floor((attemptNumber / maxRetries) * 100);
            await job.progress(progressPercent);
            throw error;
        }
    }
    async handleSendBulk(job) {
        const { recipients, message, metadata } = job.data;
        this.logger.log(`Processing bulk SMS job ${job.id} - ${recipients.length} recipients`);
        const results = [];
        for (let i = 0; i < recipients.length; i++) {
            const to = recipients[i];
            try {
                const result = await this.twilioProvider.sendSms(to, message, metadata);
                results.push(result);
                const progress = Math.floor(((i + 1) / recipients.length) * 100);
                await job.progress(progress);
            }
            catch (error) {
                this.logger.error(`Bulk SMS failed for ${to}: ${error.message}`);
                results.push({
                    status: sms_queue_job_dto_1.SmsDeliveryStatus.FAILED,
                    to: to,
                    segmentCount: 1,
                    cost: 0,
                    timestamp: new Date().toISOString(),
                    error: error.message,
                });
            }
        }
        const successCount = results.filter((r) => r.status !== sms_queue_job_dto_1.SmsDeliveryStatus.FAILED).length;
        this.logger.log(`Bulk SMS job ${job.id} completed - ${successCount}/${recipients.length} successful`);
        return results;
    }
    async handleCheckStatus(job) {
        const { messageId } = job.data;
        this.logger.debug(`Checking SMS status for message ${messageId}`);
        try {
            const result = await this.twilioProvider.getMessageStatus(messageId);
            this.logger.debug(`Message ${messageId} status: ${result.status}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to check status for message ${messageId}: ${error.message}`);
            throw error;
        }
    }
    async onCompleted(job, result) {
        this.logger.log(`SMS job ${job.id} completed successfully`);
    }
    async onFailed(job, error) {
        this.logger.error(`SMS job ${job.id} failed permanently: ${error.message}`);
    }
    async onStalled(job) {
        this.logger.warn(`SMS job ${job.id} has stalled and will be retried`);
    }
    getExponentialBackoff(attemptNumber) {
        const baseDelay = 2000;
        const maxDelay = 300000;
        const delay = baseDelay * Math.pow(2, attemptNumber - 1);
        return Math.min(delay, maxDelay);
    }
};
exports.SmsQueueProcessor = SmsQueueProcessor;
__decorate([
    (0, bull_1.Process)(SmsJobType.SEND_SMS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], SmsQueueProcessor.prototype, "handleSendSms", null);
__decorate([
    (0, bull_1.Process)(SmsJobType.SEND_BULK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], SmsQueueProcessor.prototype, "handleSendBulk", null);
__decorate([
    (0, bull_1.Process)(SmsJobType.CHECK_STATUS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], SmsQueueProcessor.prototype, "handleCheckStatus", null);
exports.SmsQueueProcessor = SmsQueueProcessor = SmsQueueProcessor_1 = __decorate([
    (0, bull_1.Processor)(exports.SMS_QUEUE_NAME),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [twilio_provider_1.TwilioProvider])
], SmsQueueProcessor);
//# sourceMappingURL=sms-queue.processor.js.map