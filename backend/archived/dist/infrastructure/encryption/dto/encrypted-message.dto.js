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
exports.EncryptionResultDto = exports.BulkEncryptMessagesDto = exports.DecryptedMessageDto = exports.DecryptMessageDto = exports.EncryptedMessageDto = exports.CreateEncryptedMessageDto = exports.EncryptionMetadataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const interfaces_1 = require("../interfaces");
class EncryptionMetadataDto {
    algorithm;
    iv;
    authTag;
    keyId;
    timestamp;
    version;
    static _OPENAPI_METADATA_FACTORY() {
        return { algorithm: { required: true, enum: require("../interfaces/encryption.interfaces").EncryptionAlgorithm }, iv: { required: true, type: () => String }, authTag: { required: true, type: () => String }, keyId: { required: true, type: () => String }, timestamp: { required: true, type: () => Number }, version: { required: true, type: () => String } };
    }
}
exports.EncryptionMetadataDto = EncryptionMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption algorithm used',
        enum: interfaces_1.EncryptionAlgorithm,
        example: interfaces_1.EncryptionAlgorithm.AES_256_GCM,
    }),
    (0, class_validator_1.IsEnum)(interfaces_1.EncryptionAlgorithm),
    __metadata("design:type", String)
], EncryptionMetadataDto.prototype, "algorithm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initialization vector (base64 encoded)',
        example: 'aGVsbG93b3JsZA==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionMetadataDto.prototype, "iv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Authentication tag (base64 encoded)',
        example: 'dGFnZXhhbXBsZQ==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionMetadataDto.prototype, "authTag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key identifier for retrieving decryption key',
        example: 'key_user123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionMetadataDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when encryption occurred',
        example: 1635789012345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EncryptionMetadataDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Version of encryption implementation',
        example: '1.0.0',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionMetadataDto.prototype, "version", void 0);
class CreateEncryptedMessageDto {
    message;
    senderId;
    recipientIds;
    conversationId;
    aad;
    keyId;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String }, senderId: { required: true, type: () => String }, recipientIds: { required: true, type: () => [String] }, conversationId: { required: true, type: () => String }, aad: { required: false, type: () => String }, keyId: { required: false, type: () => String } };
    }
}
exports.CreateEncryptedMessageDto = CreateEncryptedMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plain text message content to encrypt',
        example: 'This is a sensitive message',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncryptedMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of message sender',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncryptedMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs of message recipients',
        example: ['user-456', 'user-789'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateEncryptedMessageDto.prototype, "recipientIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncryptedMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional authenticated data (not encrypted but authenticated)',
        example: 'metadata-string',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncryptedMessageDto.prototype, "aad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom session key ID to use',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEncryptedMessageDto.prototype, "keyId", void 0);
class EncryptedMessageDto {
    encryptedContent;
    metadata;
    senderId;
    recipientIds;
    conversationId;
    isEncrypted;
    static _OPENAPI_METADATA_FACTORY() {
        return { encryptedContent: { required: true, type: () => String }, metadata: { required: true, type: () => require("./encrypted-message.dto").EncryptionMetadataDto }, senderId: { required: true, type: () => String }, recipientIds: { required: true, type: () => [String] }, conversationId: { required: true, type: () => String }, isEncrypted: { required: true, type: () => Boolean } };
    }
}
exports.EncryptedMessageDto = EncryptedMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64-encoded encrypted content',
        example: 'ZW5jcnlwdGVkY29udGVudA==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedMessageDto.prototype, "encryptedContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption metadata',
        type: EncryptionMetadataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EncryptionMetadataDto),
    __metadata("design:type", EncryptionMetadataDto)
], EncryptedMessageDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of message sender',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs of message recipients',
        example: ['user-456', 'user-789'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EncryptedMessageDto.prototype, "recipientIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this message is encrypted',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EncryptedMessageDto.prototype, "isEncrypted", void 0);
class DecryptMessageDto {
    encryptedContent;
    metadata;
    recipientId;
    conversationId;
    aad;
    static _OPENAPI_METADATA_FACTORY() {
        return { encryptedContent: { required: true, type: () => String }, metadata: { required: true, type: () => require("./encrypted-message.dto").EncryptionMetadataDto }, recipientId: { required: true, type: () => String }, conversationId: { required: true, type: () => String }, aad: { required: false, type: () => String } };
    }
}
exports.DecryptMessageDto = DecryptMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64-encoded encrypted content',
        example: 'ZW5jcnlwdGVkY29udGVudA==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptMessageDto.prototype, "encryptedContent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption metadata',
        type: EncryptionMetadataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EncryptionMetadataDto),
    __metadata("design:type", EncryptionMetadataDto)
], DecryptMessageDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of recipient requesting decryption',
        example: 'user-456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptMessageDto.prototype, "recipientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptMessageDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional authenticated data (must match encryption AAD)',
        example: 'metadata-string',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptMessageDto.prototype, "aad", void 0);
class DecryptedMessageDto {
    content;
    metadata;
    success;
    static _OPENAPI_METADATA_FACTORY() {
        return { content: { required: true, type: () => String }, metadata: { required: true, type: () => require("./encrypted-message.dto").EncryptionMetadataDto }, success: { required: true, type: () => Boolean } };
    }
}
exports.DecryptedMessageDto = DecryptedMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Decrypted message content',
        example: 'This is a sensitive message',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptedMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original encryption metadata',
        type: EncryptionMetadataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EncryptionMetadataDto),
    __metadata("design:type", EncryptionMetadataDto)
], DecryptedMessageDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether decryption was successful',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DecryptedMessageDto.prototype, "success", void 0);
class BulkEncryptMessagesDto {
    messages;
    useSharedKey;
    static _OPENAPI_METADATA_FACTORY() {
        return { messages: { required: true, type: () => [require("./encrypted-message.dto").CreateEncryptedMessageDto] }, useSharedKey: { required: false, type: () => Boolean } };
    }
}
exports.BulkEncryptMessagesDto = BulkEncryptMessagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of messages to encrypt',
        type: [CreateEncryptedMessageDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateEncryptedMessageDto),
    __metadata("design:type", Array)
], BulkEncryptMessagesDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Use same session key for all messages',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkEncryptMessagesDto.prototype, "useSharedKey", void 0);
class EncryptionResultDto {
    success;
    data;
    metadata;
    error;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, data: { required: false, type: () => String }, metadata: { required: false, type: () => require("./encrypted-message.dto").EncryptionMetadataDto }, error: { required: false, type: () => String }, message: { required: false, type: () => String } };
    }
}
exports.EncryptionResultDto = EncryptionResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether operation was successful',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EncryptionResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encrypted data (if successful)',
        example: 'ZW5jcnlwdGVkZGF0YQ==',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionResultDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encryption metadata (if successful)',
        type: EncryptionMetadataDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EncryptionMetadataDto),
    __metadata("design:type", EncryptionMetadataDto)
], EncryptionResultDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message (if failed)',
        example: 'Encryption failed',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionResultDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detailed error message',
        example: 'Invalid encryption key',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionResultDto.prototype, "message", void 0);
//# sourceMappingURL=encrypted-message.dto.js.map