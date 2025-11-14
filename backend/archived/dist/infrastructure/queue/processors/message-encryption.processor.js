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
var MessageEncryptionProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEncryptionProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const base_processor_1 = require("../base.processor");
let MessageEncryptionProcessor = MessageEncryptionProcessor_1 = class MessageEncryptionProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(MessageEncryptionProcessor_1.name);
    }
    async processEncryption(job) {
        return this.executeJobWithCommonHandling(job, { messageId: job.data.messageId, operation: job.data.operation }, async () => {
            await job.progress({
                percentage: 25,
                step: `Starting ${job.data.operation}`,
            });
            let result;
            if (job.data.operation === 'encrypt') {
                result = await this.encryptContent(job.data.content, job.data.keyId);
            }
            else {
                result = await this.decryptContent(job.data.content, job.data.keyId);
            }
            await job.progress({
                percentage: 100,
                step: `${job.data.operation} completed`,
            });
            return {
                messageId: job.data.messageId,
                operation: job.data.operation,
                result,
            };
        });
    }
    async encryptContent(content, keyId) {
        const _keyId = keyId;
        await this.delay(200);
        return Buffer.from(content).toString('base64');
    }
    async decryptContent(content, keyId) {
        const _keyId = keyId;
        await this.delay(200);
        return Buffer.from(content, 'base64').toString('utf-8');
    }
};
exports.MessageEncryptionProcessor = MessageEncryptionProcessor;
__decorate([
    (0, bull_1.Process)('encrypt-decrypt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageEncryptionProcessor.prototype, "processEncryption", null);
exports.MessageEncryptionProcessor = MessageEncryptionProcessor = MessageEncryptionProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.MESSAGE_ENCRYPTION),
    __metadata("design:paramtypes", [])
], MessageEncryptionProcessor);
//# sourceMappingURL=message-encryption.processor.js.map