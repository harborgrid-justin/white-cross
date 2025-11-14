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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCleanupJobDto = exports.BatchMessageJobDto = exports.BatchMessageItem = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BatchMessageItem {
    recipientId;
    content;
    variables;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipientId: { required: true, type: () => String, description: "Recipient user ID", format: "uuid" }, content: { required: false, type: () => String, description: "Message content (can be customized per recipient)", maxLength: 10000 }, variables: { required: false, type: () => Object, description: "Custom variables for templating" } };
    }
}
exports.BatchMessageItem = BatchMessageItem;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BatchMessageItem.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], BatchMessageItem.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BatchMessageItem.prototype, "variables", void 0);
class BatchMessageJobDto {
    batchId;
    senderId;
    recipientIds;
    content;
    templateId;
    templateVariables;
    customizedMessages;
    conversationIds;
    createConversations;
    chunkSize;
    chunkDelay;
    createdAt;
    initiatedBy;
    jobId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { batchId: { required: false, type: () => String, description: "Batch job identifier", format: "uuid" }, senderId: { required: true, type: () => String, description: "Sender user ID", format: "uuid" }, recipientIds: { required: true, type: () => [String], description: "Recipient user IDs", format: "uuid" }, content: { required: true, type: () => String, description: "Message content (used for all recipients if not customized)", maxLength: 10000 }, templateId: { required: false, type: () => String, description: "Message template ID (if using template)" }, templateVariables: { required: false, type: () => Object, description: "Template variables (common for all recipients)" }, customizedMessages: { required: false, type: () => [require("./batch-message-job.dto").BatchMessageItem], description: "Customized messages for individual recipients" }, conversationIds: { required: false, type: () => [String], description: "Conversation IDs for each recipient (optional)\nIf provided, must match recipientIds length", format: "uuid" }, createConversations: { required: false, type: () => Boolean, description: "Whether to create new conversations if they don't exist" }, chunkSize: { required: false, type: () => Number, description: "Batch processing chunk size\nControls how many messages are sent per chunk", minimum: 1, maximum: 1000 }, chunkDelay: { required: false, type: () => Number, description: "Delay between chunks in milliseconds", minimum: 0 }, createdAt: { required: true, type: () => Date, description: "Job creation timestamp" }, initiatedBy: { required: false, type: () => String, description: "User who initiated the job" }, jobId: { required: false, type: () => String, description: "Job identifier" }, metadata: { required: false, type: () => Object, description: "Additional metadata" } };
    }
}
exports.BatchMessageJobDto = BatchMessageJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "batchId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BatchMessageJobDto.prototype, "recipientIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BatchMessageJobDto.prototype, "templateVariables", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BatchMessageItem),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BatchMessageJobDto.prototype, "customizedMessages", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BatchMessageJobDto.prototype, "conversationIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], BatchMessageJobDto.prototype, "createConversations", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BatchMessageJobDto.prototype, "chunkSize", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BatchMessageJobDto.prototype, "chunkDelay", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BatchMessageJobDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "initiatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BatchMessageJobDto.prototype, "metadata", void 0);
class MessageCleanupJobDto {
    cleanupType;
    olderThan;
    retentionDays;
    conversationIds;
    userIds;
    batchSize;
    dryRun;
    createdAt;
    initiatedBy;
    jobId;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { cleanupType: { required: true, type: () => Object, description: "Cleanup type" }, olderThan: { required: false, type: () => Date, description: "Delete messages older than this date" }, retentionDays: { required: false, type: () => Number, description: "Number of days to keep messages", minimum: 1 }, conversationIds: { required: false, type: () => [String], description: "Specific conversation IDs to clean", format: "uuid" }, userIds: { required: false, type: () => [String], description: "User IDs whose messages should be cleaned", format: "uuid" }, batchSize: { required: false, type: () => Number, description: "Maximum number of messages to delete in one run", minimum: 1, maximum: 10000 }, dryRun: { required: false, type: () => Boolean, description: "Whether to perform a dry run (count only, no deletion)" }, createdAt: { required: true, type: () => Date, description: "Job creation timestamp" }, initiatedBy: { required: false, type: () => String, description: "User who initiated the job" }, jobId: { required: false, type: () => String, description: "Job identifier" }, metadata: { required: false, type: () => Object, description: "Additional metadata" } };
    }
}
exports.MessageCleanupJobDto = MessageCleanupJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MessageCleanupJobDto.prototype, "cleanupType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], MessageCleanupJobDto.prototype, "olderThan", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageCleanupJobDto.prototype, "retentionDays", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], MessageCleanupJobDto.prototype, "conversationIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], MessageCleanupJobDto.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageCleanupJobDto.prototype, "batchSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MessageCleanupJobDto.prototype, "dryRun", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], MessageCleanupJobDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MessageCleanupJobDto.prototype, "initiatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MessageCleanupJobDto.prototype, "jobId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], MessageCleanupJobDto.prototype, "metadata", void 0);
//# sourceMappingURL=batch-message-job.dto.js.map