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
exports.UpdateParticipantDto = exports.AddParticipantDto = exports.NotificationPreference = exports.ParticipantRole = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["OWNER"] = "OWNER";
    ParticipantRole["ADMIN"] = "ADMIN";
    ParticipantRole["MEMBER"] = "MEMBER";
    ParticipantRole["VIEWER"] = "VIEWER";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var NotificationPreference;
(function (NotificationPreference) {
    NotificationPreference["ALL"] = "ALL";
    NotificationPreference["MENTIONS"] = "MENTIONS";
    NotificationPreference["NONE"] = "NONE";
})(NotificationPreference || (exports.NotificationPreference = NotificationPreference = {}));
class AddParticipantDto {
    userId;
    role;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String, format: "uuid" }, role: { required: false, enum: require("./conversation-participant.dto").ParticipantRole } };
    }
}
exports.AddParticipantDto = AddParticipantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to add to the conversation',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Role to assign to the participant',
        enum: ParticipantRole,
        default: ParticipantRole.MEMBER,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ParticipantRole),
    __metadata("design:type", String)
], AddParticipantDto.prototype, "role", void 0);
class UpdateParticipantDto {
    role;
    isMuted;
    isPinned;
    customName;
    notificationPreference;
    static _OPENAPI_METADATA_FACTORY() {
        return { role: { required: false, enum: require("./conversation-participant.dto").ParticipantRole }, isMuted: { required: false, type: () => Boolean }, isPinned: { required: false, type: () => Boolean }, customName: { required: false, type: () => String, maxLength: 255 }, notificationPreference: { required: false, enum: require("./conversation-participant.dto").NotificationPreference } };
    }
}
exports.UpdateParticipantDto = UpdateParticipantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update participant role',
        enum: ParticipantRole,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ParticipantRole),
    __metadata("design:type", String)
], UpdateParticipantDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to mute notifications',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateParticipantDto.prototype, "isMuted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to pin the conversation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateParticipantDto.prototype, "isPinned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom display name for this participant',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateParticipantDto.prototype, "customName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notification preference',
        enum: NotificationPreference,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NotificationPreference),
    __metadata("design:type", String)
], UpdateParticipantDto.prototype, "notificationPreference", void 0);
//# sourceMappingURL=conversation-participant.dto.js.map