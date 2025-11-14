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
exports.NotifyWaitlistEntryDto = exports.RemoveFromWaitlistDto = exports.UpdateWaitlistPriorityDto = exports.WaitlistFiltersDto = exports.CreateWaitlistEntryDto = exports.WaitlistStatus = exports.WaitlistPriority = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_appointment_dto_1 = require("./create-appointment.dto");
var WaitlistPriority;
(function (WaitlistPriority) {
    WaitlistPriority["LOW"] = "LOW";
    WaitlistPriority["NORMAL"] = "NORMAL";
    WaitlistPriority["HIGH"] = "HIGH";
    WaitlistPriority["URGENT"] = "URGENT";
})(WaitlistPriority || (exports.WaitlistPriority = WaitlistPriority = {}));
var WaitlistStatus;
(function (WaitlistStatus) {
    WaitlistStatus["WAITING"] = "WAITING";
    WaitlistStatus["NOTIFIED"] = "NOTIFIED";
    WaitlistStatus["SCHEDULED"] = "SCHEDULED";
    WaitlistStatus["EXPIRED"] = "EXPIRED";
    WaitlistStatus["CANCELLED"] = "CANCELLED";
})(WaitlistStatus || (exports.WaitlistStatus = WaitlistStatus = {}));
class CreateWaitlistEntryDto {
    studentId;
    nurseId;
    type;
    reason;
    priority;
    preferredDate;
    duration;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, nurseId: { required: false, type: () => String, format: "uuid" }, type: { required: true, enum: require("./create-appointment.dto").AppointmentType }, reason: { required: true, type: () => String }, priority: { required: false, enum: require("./waitlist.dto").WaitlistPriority }, preferredDate: { required: false, type: () => Date }, duration: { required: false, type: () => Number, minimum: 15, maximum: 120 }, notes: { required: false, type: () => String } };
    }
}
exports.CreateWaitlistEntryDto = CreateWaitlistEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID to add to waitlist',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred nurse UUID (optional - any available nurse if not specified)',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of appointment needed',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
    }),
    (0, class_validator_1.IsEnum)(create_appointment_dto_1.AppointmentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the appointment',
        example: 'Student needs medication administration',
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Priority level for waitlist positioning',
        enum: WaitlistPriority,
        example: WaitlistPriority.NORMAL,
        default: WaitlistPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(WaitlistPriority),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred appointment date',
        example: '2025-10-28',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateWaitlistEntryDto.prototype, "preferredDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred appointment duration in minutes',
        example: 30,
        minimum: 15,
        maximum: 120,
        default: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateWaitlistEntryDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for the waitlist entry',
        example: 'Student available only in afternoons',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWaitlistEntryDto.prototype, "notes", void 0);
class WaitlistFiltersDto {
    nurseId;
    studentId;
    status;
    priority;
    type;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { nurseId: { required: false, type: () => String, format: "uuid" }, studentId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("./waitlist.dto").WaitlistStatus }, priority: { required: false, enum: require("./waitlist.dto").WaitlistPriority }, type: { required: false, enum: require("./create-appointment.dto").AppointmentType }, page: { required: false, type: () => Number, minimum: 1 }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 } };
    }
}
exports.WaitlistFiltersDto = WaitlistFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], WaitlistFiltersDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], WaitlistFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by waitlist status',
        enum: WaitlistStatus,
        example: WaitlistStatus.WAITING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(WaitlistStatus),
    __metadata("design:type", String)
], WaitlistFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by priority level',
        enum: WaitlistPriority,
        example: WaitlistPriority.NORMAL,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(WaitlistPriority),
    __metadata("design:type", String)
], WaitlistFiltersDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by appointment type',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_appointment_dto_1.AppointmentType),
    __metadata("design:type", String)
], WaitlistFiltersDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], WaitlistFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], WaitlistFiltersDto.prototype, "limit", void 0);
class UpdateWaitlistPriorityDto {
    priority;
    static _OPENAPI_METADATA_FACTORY() {
        return { priority: { required: true, enum: require("./waitlist.dto").WaitlistPriority } };
    }
}
exports.UpdateWaitlistPriorityDto = UpdateWaitlistPriorityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New priority level',
        enum: WaitlistPriority,
        example: WaitlistPriority.HIGH,
    }),
    (0, class_validator_1.IsEnum)(WaitlistPriority),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateWaitlistPriorityDto.prototype, "priority", void 0);
class RemoveFromWaitlistDto {
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String } };
    }
}
exports.RemoveFromWaitlistDto = RemoveFromWaitlistDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for removing from waitlist',
        example: 'Student no longer needs appointment',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveFromWaitlistDto.prototype, "reason", void 0);
class NotifyWaitlistEntryDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: false, type: () => String } };
    }
}
exports.NotifyWaitlistEntryDto = NotifyWaitlistEntryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom notification message',
        example: 'An appointment slot has become available for tomorrow at 2:00 PM',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NotifyWaitlistEntryDto.prototype, "message", void 0);
//# sourceMappingURL=waitlist.dto.js.map