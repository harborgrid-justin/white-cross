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
var BatchMessageProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchMessageProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const base_processor_1 = require("../base.processor");
let BatchMessageProcessor = BatchMessageProcessor_1 = class BatchMessageProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(BatchMessageProcessor_1.name);
    }
    async processBatchMessage(job) {
        const totalRecipients = job.data.recipientIds.length;
        return this.executeJobWithCommonHandling(job, { messageId: job.data.batchId, operation: 'batch-send' }, async () => {
            const chunkSize = job.data.chunkSize || 10;
            const chunkDelay = job.data.chunkDelay || 100;
            let processedCount = 0;
            for (let i = 0; i < totalRecipients; i += chunkSize) {
                const chunk = job.data.recipientIds.slice(i, i + chunkSize);
                await this.sendToRecipients(chunk, job.data);
                processedCount += chunk.length;
                const percentage = Math.floor((processedCount / totalRecipients) * 100);
                await job.progress({
                    percentage,
                    step: 'Sending messages',
                    currentStep: processedCount,
                    totalSteps: totalRecipients,
                });
                if (i + chunkSize < totalRecipients) {
                    await this.delay(chunkDelay);
                }
            }
            return {
                batchId: job.data.batchId,
                recipientCount: totalRecipients,
                processedCount,
                sentAt: new Date(),
            };
        });
    }
    async sendToRecipients(recipientIds, data) {
        const _data = data;
        await this.delay(recipientIds.length * 10);
    }
};
exports.BatchMessageProcessor = BatchMessageProcessor;
__decorate([
    (0, bull_1.Process)('batch-send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BatchMessageProcessor.prototype, "processBatchMessage", null);
exports.BatchMessageProcessor = BatchMessageProcessor = BatchMessageProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.BATCH_MESSAGE_SENDING),
    __metadata("design:paramtypes", [])
], BatchMessageProcessor);
//# sourceMappingURL=batch-message.processor.js.map