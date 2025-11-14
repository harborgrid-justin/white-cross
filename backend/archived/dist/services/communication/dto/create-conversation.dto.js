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
exports.CreateConversationDto = exports.CreateConversationParticipantDto = exports.ConversationType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ConversationType;
(function (ConversationType) {
    ConversationType["DIRECT"] = "DIRECT";
    ConversationType["GROUP"] = "GROUP";
    ConversationType["CHANNEL"] = "CHANNEL";
})(ConversationType || (exports.ConversationType = ConversationType = {}));
class CreateConversationParticipantDto {
    userId;
    role;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String, format: "uuid" }, role: { required: false, type: () => String } };
    }
}
exports.CreateConversationParticipantDto = CreateConversationParticipantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the participant',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConversationParticipantDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role of the participant',
        enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
        default: 'MEMBER',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
    __metadata("design:type", String)
], CreateConversationParticipantDto.prototype, "role", void 0);
class CreateConversationDto {
    type;
    name;
    description;
    avatarUrl;
    participants;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./create-conversation.dto").ConversationType }, name: { required: false, type: () => String, minLength: 1, maxLength: 255 }, description: { required: false, type: () => String, maxLength: 1000 }, avatarUrl: { required: false, type: () => String, format: "uri" }, participants: { required: true, type: () => [require("./create-conversation.dto").CreateConversationParticipantDto], minItems: 1 }, metadata: { required: false, type: () => Object } };
    }
}
exports.CreateConversationDto = CreateConversationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of conversation',
        enum: ConversationType,
        example: ConversationType.GROUP,
    }),
    (0, class_validator_1.IsEnum)(ConversationType),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conversation name (required for GROUP and CHANNEL)',
        minLength: 1,
        maxLength: 255,
        example: 'Project Team Discussion',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conversation description',
        maxLength: 1000,
        example: 'Discussion space for project collaboration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Avatar/profile image URL',
        example: 'https://example.com/avatar.png',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateConversationDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initial participants (must include at least one participant)',
        type: [CreateConversationParticipantDto],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateConversationParticipantDto),
    __metadata("design:type", Array)
], CreateConversationDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional metadata for the conversation',
        type: 'object',
        additionalProperties: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateConversationDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-conversation.dto.js.map