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
exports.CreateEmergencyBroadcastDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const emergency_broadcast_enums_1 = require("../emergency-broadcast.enums");
class CreateEmergencyBroadcastDto {
    type;
    priority;
    title;
    message;
    audience;
    schoolId;
    gradeLevel;
    classId;
    groupIds;
    channels;
    requiresAcknowledgment;
    expiresAt;
    sentBy;
    followUpRequired;
    followUpInstructions;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("../emergency-broadcast.enums").EmergencyType }, priority: { required: false, enum: require("../emergency-broadcast.enums").EmergencyPriority }, title: { required: true, type: () => String, maxLength: 200 }, message: { required: true, type: () => String, maxLength: 2000 }, audience: { required: true, enum: require("../emergency-broadcast.enums").BroadcastAudience, isArray: true, minItems: 1 }, schoolId: { required: false, type: () => String }, gradeLevel: { required: false, type: () => String }, classId: { required: false, type: () => String }, groupIds: { required: false, type: () => [String] }, channels: { required: false, enum: require("../emergency-broadcast.enums").CommunicationChannel, isArray: true }, requiresAcknowledgment: { required: false, type: () => Boolean }, expiresAt: { required: false, type: () => Date }, sentBy: { required: true, type: () => String }, followUpRequired: { required: false, type: () => Boolean }, followUpInstructions: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.CreateEmergencyBroadcastDto = CreateEmergencyBroadcastDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of emergency',
        enum: emergency_broadcast_enums_1.EmergencyType,
        example: emergency_broadcast_enums_1.EmergencyType.MEDICAL_EMERGENCY,
    }),
    (0, class_validator_1.IsEnum)(emergency_broadcast_enums_1.EmergencyType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority level of the emergency',
        enum: emergency_broadcast_enums_1.EmergencyPriority,
        example: emergency_broadcast_enums_1.EmergencyPriority.HIGH,
    }),
    (0, class_validator_1.IsEnum)(emergency_broadcast_enums_1.EmergencyPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brief title of the emergency broadcast',
        example: 'Medical Emergency - Building A',
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed message content',
        example: 'A medical emergency is in progress in Building A. Please avoid this area and follow staff instructions.',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target audience for the broadcast',
        enum: emergency_broadcast_enums_1.BroadcastAudience,
        isArray: true,
        example: [emergency_broadcast_enums_1.BroadcastAudience.ALL_PARENTS, emergency_broadcast_enums_1.BroadcastAudience.ALL_STAFF],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsEnum)(emergency_broadcast_enums_1.BroadcastAudience, { each: true }),
    __metadata("design:type", Array)
], CreateEmergencyBroadcastDto.prototype, "audience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter to specific school (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter to specific grade level',
        example: '3rd Grade',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "classId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEmergencyBroadcastDto.prototype, "groupIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(emergency_broadcast_enums_1.CommunicationChannel, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateEmergencyBroadcastDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEmergencyBroadcastDto.prototype, "requiresAcknowledgment", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEmergencyBroadcastDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "sentBy", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEmergencyBroadcastDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateEmergencyBroadcastDto.prototype, "followUpInstructions", void 0);
//# sourceMappingURL=create-emergency-broadcast.dto.js.map