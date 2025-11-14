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
exports.BroadcastMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const message_category_enum_1 = require("../enums/message-category.enum");
const message_priority_enum_1 = require("../enums/message-priority.enum");
const message_type_enum_1 = require("../enums/message-type.enum");
class BroadcastAudienceDto {
    grades;
    nurseIds;
    studentIds;
    includeParents;
    includeEmergencyContacts;
    static _OPENAPI_METADATA_FACTORY() {
        return { grades: { required: false, type: () => [String] }, nurseIds: { required: false, type: () => [String] }, studentIds: { required: false, type: () => [String] }, includeParents: { required: false, type: () => Boolean }, includeEmergencyContacts: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BroadcastAudienceDto.prototype, "grades", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BroadcastAudienceDto.prototype, "nurseIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BroadcastAudienceDto.prototype, "studentIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BroadcastAudienceDto.prototype, "includeParents", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BroadcastAudienceDto.prototype, "includeEmergencyContacts", void 0);
class BroadcastMessageDto {
    audience;
    channels;
    subject;
    content;
    priority;
    category;
    senderId;
    scheduledAt;
    translateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { audience: { required: true, type: () => BroadcastAudienceDto }, channels: { required: true, enum: require("../enums/message-type.enum").MessageType, isArray: true, minItems: 1 }, subject: { required: false, type: () => String }, content: { required: true, type: () => String }, priority: { required: true, enum: require("../enums/message-priority.enum").MessagePriority }, category: { required: true, enum: require("../enums/message-category.enum").MessageCategory }, senderId: { required: true, type: () => String }, scheduledAt: { required: false, type: () => Date }, translateTo: { required: false, type: () => [String] } };
    }
}
exports.BroadcastMessageDto = BroadcastMessageDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BroadcastAudienceDto),
    __metadata("design:type", BroadcastAudienceDto)
], BroadcastMessageDto.prototype, "audience", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsEnum)(message_type_enum_1.MessageType, { each: true }),
    __metadata("design:type", Array)
], BroadcastMessageDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(message_priority_enum_1.MessagePriority),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(message_category_enum_1.MessageCategory),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "senderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], BroadcastMessageDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BroadcastMessageDto.prototype, "translateTo", void 0);
//# sourceMappingURL=broadcast-message.dto.js.map