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
exports.ScheduleFollowUpDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const follow_up_status_enum_1 = require("../../enums/follow-up-status.enum");
class ScheduleFollowUpDto {
    studentId;
    originalVisitId;
    scheduledBy;
    scheduledDate;
    durationMinutes = 30;
    reason;
    type;
    status;
    assignedTo;
    priority;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, originalVisitId: { required: false, type: () => String, format: "uuid" }, scheduledBy: { required: true, type: () => String, format: "uuid" }, scheduledDate: { required: true, type: () => Date }, durationMinutes: { required: false, type: () => Number, default: 30, minimum: 15 }, reason: { required: true, type: () => String }, type: { required: true, type: () => String }, status: { required: false, enum: require("../../enums/follow-up-status.enum").FollowUpStatus }, assignedTo: { required: false, type: () => String, format: "uuid" }, priority: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.ScheduleFollowUpDto = ScheduleFollowUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original clinic visit ID that triggered follow-up',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "originalVisitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff member scheduling the follow-up' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "scheduledBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time',
        example: '2025-11-15T14:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ScheduleFollowUpDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Duration in minutes',
        example: 30,
        minimum: 15,
        default: 30,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ScheduleFollowUpDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for follow-up',
        example: 'Recheck blood pressure',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Follow-up type', example: 'routine' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Initial status',
        enum: follow_up_status_enum_1.FollowUpStatus,
        default: follow_up_status_enum_1.FollowUpStatus.SCHEDULED,
    }),
    (0, class_validator_1.IsEnum)(follow_up_status_enum_1.FollowUpStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assign to specific staff member' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "assignedTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Priority level', example: 'normal' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleFollowUpDto.prototype, "notes", void 0);
//# sourceMappingURL=schedule-follow-up.dto.js.map