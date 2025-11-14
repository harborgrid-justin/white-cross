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
var MessageIndexingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageIndexingProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const base_processor_1 = require("../base.processor");
let MessageIndexingProcessor = MessageIndexingProcessor_1 = class MessageIndexingProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(MessageIndexingProcessor_1.name);
    }
    async processIndexing(job) {
        return this.executeJobWithCommonHandling(job, { messageId: job.data.messageId, operation: job.data.operation }, async () => {
            await job.progress({
                percentage: 30,
                step: `${job.data.operation} index`,
            });
            switch (job.data.operation) {
                case 'index':
                    await this.indexMessage(job.data);
                    break;
                case 'update':
                    await this.updateMessageIndex(job.data);
                    break;
                case 'delete':
                    await this.deleteMessageIndex(job.data.messageId);
                    break;
            }
            await job.progress({
                percentage: 100,
                step: 'Indexing completed',
            });
            return {
                messageId: job.data.messageId,
                operation: job.data.operation,
                indexedAt: new Date(),
            };
        });
    }
    async indexMessage(data) {
        const _data = data;
        await this.delay(150);
    }
    async updateMessageIndex(data) {
        const _data = data;
        await this.delay(100);
    }
    async deleteMessageIndex(messageId) {
        const _messageId = messageId;
        await this.delay(80);
    }
};
exports.MessageIndexingProcessor = MessageIndexingProcessor;
__decorate([
    (0, bull_1.Process)('index-message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageIndexingProcessor.prototype, "processIndexing", null);
exports.MessageIndexingProcessor = MessageIndexingProcessor = MessageIndexingProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.MESSAGE_INDEXING),
    __metadata("design:paramtypes", [])
], MessageIndexingProcessor);
//# sourceMappingURL=message-indexing.processor.js.map