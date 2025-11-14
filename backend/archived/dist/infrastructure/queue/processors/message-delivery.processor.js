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
var MessageDeliveryProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDeliveryProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const base_processor_1 = require("../base.processor");
let MessageDeliveryProcessor = MessageDeliveryProcessor_1 = class MessageDeliveryProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(MessageDeliveryProcessor_1.name);
    }
    async processSendMessage(job) {
        return this.executeJobWithCommonHandling(job, { messageId: job.data.messageId, operation: 'send-message' }, async () => {
            await job.progress({
                percentage: 10,
                step: 'Validating message',
            });
            await job.progress({
                percentage: 50,
                step: 'Sending message',
            });
            await this.delay(100);
            await job.progress({
                percentage: 100,
                step: 'Message sent',
            });
            return {
                messageId: job.data.messageId,
                sentAt: new Date(),
            };
        });
    }
    async processDeliveryConfirmation(job) {
        return this.executeJobWithCommonHandling(job, { messageId: job.data.messageId, operation: 'delivery-confirmation' }, async () => {
            await this.delay(50);
            return {
                messageId: job.data.messageId,
                status: job.data.status,
                confirmedAt: new Date(),
            };
        });
    }
};
exports.MessageDeliveryProcessor = MessageDeliveryProcessor;
__decorate([
    (0, bull_1.Process)('send-message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageDeliveryProcessor.prototype, "processSendMessage", null);
__decorate([
    (0, bull_1.Process)('delivery-confirmation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageDeliveryProcessor.prototype, "processDeliveryConfirmation", null);
exports.MessageDeliveryProcessor = MessageDeliveryProcessor = MessageDeliveryProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.MESSAGE_DELIVERY),
    __metadata("design:paramtypes", [])
], MessageDeliveryProcessor);
//# sourceMappingURL=message-delivery.processor.js.map