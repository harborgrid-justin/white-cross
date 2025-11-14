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
exports.CreateAppointmentDto = exports.AppointmentType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["ROUTINE_CHECKUP"] = "ROUTINE_CHECKUP";
    AppointmentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    AppointmentType["INJURY_ASSESSMENT"] = "INJURY_ASSESSMENT";
    AppointmentType["ILLNESS_EVALUATION"] = "ILLNESS_EVALUATION";
    AppointmentType["FOLLOW_UP"] = "FOLLOW_UP";
    AppointmentType["SCREENING"] = "SCREENING";
    AppointmentType["EMERGENCY"] = "EMERGENCY";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
class CreateAppointmentDto {
    studentId;
    nurseId;
    appointmentType;
    scheduledDate;
    duration;
    reason;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, nurseId: { required: true, type: () => String, format: "uuid" }, appointmentType: { required: true, enum: require("./create-appointment.dto").AppointmentType }, scheduledDate: { required: true, type: () => Date }, duration: { required: false, type: () => Number, minimum: 15, maximum: 120 }, reason: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID who the appointment is for',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nurse/healthcare provider UUID assigned to the appointment',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of appointment being scheduled',
        enum: AppointmentType,
        example: AppointmentType.ROUTINE_CHECKUP,
    }),
    (0, class_validator_1.IsEnum)(AppointmentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time for the appointment',
        example: '2025-10-28T10:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateAppointmentDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Duration of appointment in minutes (15-120 minutes)',
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
], CreateAppointmentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for the appointment',
        example: 'Annual physical examination',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes or special instructions for the appointment',
        example: 'Student has fear of needles, please use distraction techniques',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-appointment.dto.js.map