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
exports.CreateBroadcastDto = exports.AudienceDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const send_message_dto_1 = require("./send-message.dto");
class AudienceDto {
    grades;
    nurseIds;
    studentIds;
    includeParents;
    includeEmergencyContacts;
    static _OPENAPI_METADATA_FACTORY() {
        return { grades: { required: false, type: () => [String] }, nurseIds: { required: false, type: () => [String] }, studentIds: { required: false, type: () => [String] }, includeParents: { required: false, type: () => Boolean }, includeEmergencyContacts: { required: false, type: () => Boolean } };
    }
}
exports.AudienceDto = AudienceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target grade levels',
        type: [String],
        example: ['K', '1', '2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AudienceDto.prototype, "grades", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target nurse IDs',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AudienceDto.prototype, "nurseIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target student IDs',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AudienceDto.prototype, "studentIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include parents in broadcast',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AudienceDto.prototype, "includeParents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include emergency contacts in broadcast',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AudienceDto.prototype, "includeEmergencyContacts", void 0);
class CreateBroadcastDto {
    audience;
    channels;
    subject;
    content;
    priority;
    category;
    scheduledAt;
    translateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { audience: { required: true, type: () => require("./create-broadcast.dto").AudienceDto }, channels: { required: true, enum: require("./send-message.dto").MessageType, isArray: true }, subject: { required: false, type: () => String, maxLength: 255 }, content: { required: true, type: () => String, minLength: 1, maxLength: 50000 }, priority: { required: true, enum: require("./send-message.dto").MessagePriority }, category: { required: true, enum: require("./send-message.dto").MessageCategory }, scheduledAt: { required: false, type: () => String }, translateTo: { required: false, type: () => [String] } };
    }
}
exports.CreateBroadcastDto = CreateBroadcastDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target audience configuration',
        type: AudienceDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AudienceDto),
    __metadata("design:type", AudienceDto)
], CreateBroadcastDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Communication channels to use',
        enum: send_message_dto_1.MessageType,
        isArray: true,
        example: [send_message_dto_1.MessageType.EMAIL, send_message_dto_1.MessageType.SMS],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageType, { each: true }),
    __metadata("design:type", Array)
], CreateBroadcastDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Broadcast subject line',
        maxLength: 255,
        example: 'School Emergency Notification',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBroadcastDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Broadcast message content',
        minLength: 1,
        maxLength: 50000,
        example: 'Due to severe weather, school will be closed tomorrow.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(50000),
    __metadata("design:type", String)
], CreateBroadcastDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Broadcast priority level',
        enum: send_message_dto_1.MessagePriority,
        example: send_message_dto_1.MessagePriority.URGENT,
    }),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessagePriority),
    __metadata("design:type", String)
], CreateBroadcastDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Broadcast category',
        enum: send_message_dto_1.MessageCategory,
        example: send_message_dto_1.MessageCategory.EMERGENCY,
    }),
    (0, class_validator_1.IsEnum)(send_message_dto_1.MessageCategory),
    __metadata("design:type", String)
], CreateBroadcastDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled delivery time (ISO 8601)',
        example: '2025-10-28T14:00:00Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBroadcastDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Target languages for translation',
        type: [String],
        example: ['es', 'fr'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBroadcastDto.prototype, "translateTo", void 0);
//# sourceMappingURL=create-broadcast.dto.js.map