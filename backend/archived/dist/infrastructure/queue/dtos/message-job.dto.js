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
exports.IndexingJobDto = exports.EncryptionJobDto = exports.DeliveryConfirmationJobDto = exports.MessageCleanupJobDto = exports.BatchMessageJobDto = exports.NotificationJobDto = exports.SendMessageJobDto = exports.CleanupType = exports.NotificationType = exports.DeliveryStatus = exports.EncryptionStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_queue_job_dto_1 = require("./base/base-queue-job.dto");
var EncryptionStatus;
(function (EncryptionStatus) {
    EncryptionStatus["NONE"] = "none";
    EncryptionStatus["PENDING"] = "pending";
    EncryptionStatus["ENCRYPTED"] = "encrypted";
    EncryptionStatus["FAILED"] = "failed";
})(EncryptionStatus || (exports.EncryptionStatus = EncryptionStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "pending";
    DeliveryStatus["SENT"] = "sent";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["READ"] = "read";
    DeliveryStatus["FAILED"] = "failed";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["PUSH"] = "push";
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["IN_APP"] = "in_app";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var CleanupType;
(function (CleanupType) {
    CleanupType["OLD_MESSAGES"] = "old_messages";
    CleanupType["DELETED_CONVERSATIONS"] = "deleted_conversations";
    CleanupType["EXPIRED_ATTACHMENTS"] = "expired_attachments";
})(CleanupType || (exports.CleanupType = CleanupType = {}));
class SendMessageJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    messageId;
    senderId;
    recipientId;
    content;
    conversationId;
    requiresEncryption;
    messageType;
    attachments;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Unique message identifier", format: "uuid" }, senderId: { required: true, type: () => String, description: "Sender user ID", format: "uuid" }, recipientId: { required: true, type: () => String, description: "Recipient user ID", format: "uuid" }, content: { required: true, type: () => String, description: "Message content", maxLength: 10000 }, conversationId: { required: true, type: () => String, description: "Conversation/thread ID", format: "uuid" }, requiresEncryption: { required: false, type: () => Boolean, description: "Whether message requires encryption" }, messageType: { required: false, type: () => String, description: "Message type (text, image, file, etc.)" }, attachments: { required: false, type: () => [String], description: "Attached file URLs or IDs" } };
    }
}
exports.SendMessageJobDto = SendMessageJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "conversationId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SendMessageJobDto.prototype, "requiresEncryption", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendMessageJobDto.prototype, "messageType", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendMessageJobDto.prototype, "attachments", void 0);
class NotificationJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    notificationId;
    type;
    recipientId;
    title;
    message;
    messageId;
    static _OPENAPI_METADATA_FACTORY() {
        return { notificationId: { required: true, type: () => String, description: "Notification ID", format: "uuid" }, type: { required: true, description: "Notification type", enum: require("./message-job.dto").NotificationType }, recipientId: { required: true, type: () => String, description: "Recipient user ID", format: "uuid" }, title: { required: true, type: () => String, description: "Notification title", maxLength: 200 }, message: { required: true, type: () => String, description: "Notification message", maxLength: 1000 }, messageId: { required: false, type: () => String, description: "Related message ID", format: "uuid" } };
    }
}
exports.NotificationJobDto = NotificationJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "notificationId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NotificationJobDto.prototype, "messageId", void 0);
class BatchMessageJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    batchId;
    senderId;
    recipientIds;
    conversationIds;
    content;
    chunkSize;
    chunkDelay;
    static _OPENAPI_METADATA_FACTORY() {
        return { batchId: { required: true, type: () => String, description: "Batch ID", format: "uuid" }, senderId: { required: true, type: () => String, description: "Sender user ID", format: "uuid" }, recipientIds: { required: true, type: () => [String], description: "Array of recipient user IDs", format: "uuid" }, conversationIds: { required: false, type: () => [String], description: "Array of conversation IDs", format: "uuid" }, content: { required: true, type: () => String, description: "Message content", maxLength: 10000 }, chunkSize: { required: false, type: () => Number, description: "Chunk size for batch processing", minimum: 1, maximum: 100 }, chunkDelay: { required: false, type: () => Number, description: "Delay between chunks in milliseconds", minimum: 0, maximum: 5000 } };
    }
}
exports.BatchMessageJobDto = BatchMessageJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "batchId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BatchMessageJobDto.prototype, "recipientIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BatchMessageJobDto.prototype, "conversationIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(10000),
    __metadata("design:type", String)
], BatchMessageJobDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BatchMessageJobDto.prototype, "chunkSize", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BatchMessageJobDto.prototype, "chunkDelay", void 0);
class MessageCleanupJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    cleanupType;
    retentionDays;
    batchSize;
    static _OPENAPI_METADATA_FACTORY() {
        return { cleanupType: { required: true, description: "Type of cleanup to perform", enum: require("./message-job.dto").CleanupType }, retentionDays: { required: false, type: () => Number, description: "Retention period in days", minimum: 1, maximum: 3650 }, batchSize: { required: false, type: () => Number, description: "Batch size for processing", minimum: 1, maximum: 1000 } };
    }
}
exports.MessageCleanupJobDto = MessageCleanupJobDto;
__decorate([
    (0, class_validator_1.IsEnum)(CleanupType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MessageCleanupJobDto.prototype, "cleanupType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3650),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageCleanupJobDto.prototype, "retentionDays", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessageCleanupJobDto.prototype, "batchSize", void 0);
class DeliveryConfirmationJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    messageId;
    status;
    recipientId;
    deliveredAt;
    readAt;
    failureReason;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Message ID to confirm delivery for", format: "uuid" }, status: { required: true, description: "Delivery status", enum: require("./message-job.dto").DeliveryStatus }, recipientId: { required: true, type: () => String, description: "Recipient user ID", format: "uuid" }, deliveredAt: { required: false, type: () => Date, description: "Delivery timestamp" }, readAt: { required: false, type: () => Date, description: "Read timestamp" }, failureReason: { required: false, type: () => String, description: "Failure reason if delivery failed", maxLength: 500 } };
    }
}
exports.DeliveryConfirmationJobDto = DeliveryConfirmationJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeliveryConfirmationJobDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(DeliveryStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeliveryConfirmationJobDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeliveryConfirmationJobDto.prototype, "recipientId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], DeliveryConfirmationJobDto.prototype, "deliveredAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], DeliveryConfirmationJobDto.prototype, "readAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], DeliveryConfirmationJobDto.prototype, "failureReason", void 0);
class EncryptionJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    messageId;
    operation;
    content;
    keyId;
    algorithm;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Message ID to encrypt/decrypt", format: "uuid" }, operation: { required: true, type: () => Object, description: "Operation type" }, content: { required: true, type: () => String, description: "Content to encrypt/decrypt" }, keyId: { required: false, type: () => String, description: "Encryption key identifier" }, algorithm: { required: false, type: () => String, description: "Algorithm to use" } };
    }
}
exports.EncryptionJobDto = EncryptionJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EncryptionJobDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['encrypt', 'decrypt']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EncryptionJobDto.prototype, "operation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EncryptionJobDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EncryptionJobDto.prototype, "keyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EncryptionJobDto.prototype, "algorithm", void 0);
class IndexingJobDto extends base_queue_job_dto_1.BaseQueueJobDto {
    messageId;
    operation;
    content;
    senderId;
    conversationId;
    messageTimestamp;
    static _OPENAPI_METADATA_FACTORY() {
        return { messageId: { required: true, type: () => String, description: "Message ID to index", format: "uuid" }, operation: { required: true, type: () => Object, description: "Operation type" }, content: { required: false, type: () => String, description: "Message content to index" }, senderId: { required: false, type: () => String, description: "Sender ID for indexing", format: "uuid" }, conversationId: { required: false, type: () => String, description: "Conversation ID for indexing", format: "uuid" }, messageTimestamp: { required: false, type: () => Date, description: "Message timestamp" } };
    }
}
exports.IndexingJobDto = IndexingJobDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IndexingJobDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['index', 'update', 'delete']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IndexingJobDto.prototype, "operation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IndexingJobDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IndexingJobDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IndexingJobDto.prototype, "conversationId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], IndexingJobDto.prototype, "messageTimestamp", void 0);
//# sourceMappingURL=message-job.dto.js.map