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
var MessageCleanupProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCleanupProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const enums_1 = require("../enums");
const base_processor_1 = require("../base.processor");
let MessageCleanupProcessor = MessageCleanupProcessor_1 = class MessageCleanupProcessor extends base_processor_1.BaseQueueProcessor {
    constructor() {
        super(MessageCleanupProcessor_1.name);
    }
    async processCleanup(job) {
        return this.executeJobWithCommonHandling(job, { type: job.data.cleanupType, operation: 'cleanup-messages' }, async () => {
            await job.progress({
                percentage: 20,
                step: 'Starting cleanup',
            });
            let deletedCount = 0;
            switch (job.data.cleanupType) {
                case 'old_messages':
                    deletedCount = await this.cleanupOldMessages(job.data);
                    break;
                case 'deleted_conversations':
                    deletedCount = await this.cleanupDeletedConversations(job.data);
                    break;
                case 'expired_attachments':
                    deletedCount = await this.cleanupExpiredAttachments(job.data);
                    break;
            }
            await job.progress({
                percentage: 100,
                step: 'Cleanup completed',
            });
            return {
                cleanupType: job.data.cleanupType,
                deletedCount,
                dryRun: job.data.dryRun,
                completedAt: new Date(),
            };
        });
    }
    async cleanupOldMessages(data) {
        const _data = data;
        await this.delay(500);
        return 0;
    }
    async cleanupDeletedConversations(data) {
        const _data = data;
        await this.delay(400);
        return 0;
    }
    async cleanupExpiredAttachments(data) {
        const _data = data;
        await this.delay(300);
        return 0;
    }
};
exports.MessageCleanupProcessor = MessageCleanupProcessor;
__decorate([
    (0, bull_1.Process)('cleanup-messages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageCleanupProcessor.prototype, "processCleanup", null);
exports.MessageCleanupProcessor = MessageCleanupProcessor = MessageCleanupProcessor_1 = __decorate([
    (0, bull_1.Processor)(enums_1.QueueName.MESSAGE_CLEANUP),
    __metadata("design:paramtypes", [])
], MessageCleanupProcessor);
//# sourceMappingURL=message-cleanup.processor.js.map