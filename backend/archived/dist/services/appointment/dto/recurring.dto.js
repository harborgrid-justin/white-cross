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
exports.CreateRecurringAppointmentDto = exports.RecurrencePatternDto = exports.RecurrenceFrequency = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_appointment_dto_1 = require("./create-appointment.dto");
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "daily";
    RecurrenceFrequency["WEEKLY"] = "weekly";
    RecurrenceFrequency["MONTHLY"] = "monthly";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
class RecurrencePatternDto {
    frequency;
    interval;
    endDate;
    daysOfWeek;
    static _OPENAPI_METADATA_FACTORY() {
        return { frequency: { required: true, enum: require("./recurring.dto").RecurrenceFrequency }, interval: { required: true, type: () => Number, minimum: 1, maximum: 52 }, endDate: { required: true, type: () => Date }, daysOfWeek: { required: false, type: () => [Number], minimum: 0, maximum: 6 } };
    }
}
exports.RecurrencePatternDto = RecurrencePatternDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'How often the appointment repeats',
        enum: RecurrenceFrequency,
        example: RecurrenceFrequency.WEEKLY,
    }),
    (0, class_validator_1.IsEnum)(RecurrenceFrequency),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecurrencePatternDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Interval between recurrences (e.g., every 2 weeks)',
        example: 2,
        minimum: 1,
        maximum: 52,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(52),
    __metadata("design:type", Number)
], RecurrencePatternDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for the recurring series',
        example: '2025-12-31',
        type: 'string',
        format: 'date',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], RecurrencePatternDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Days of the week for weekly recurrence (0=Sunday, 1=Monday, etc.)',
        example: [1, 3, 5],
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 6 },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], RecurrencePatternDto.prototype, "daysOfWeek", void 0);
class CreateRecurringAppointmentDto {
    studentId;
    nurseId;
    type;
    scheduledAt;
    duration;
    reason;
    notes;
    recurrence;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, nurseId: { required: true, type: () => String, format: "uuid" }, type: { required: true, enum: require("./create-appointment.dto").AppointmentType }, scheduledAt: { required: true, type: () => Date }, duration: { required: false, type: () => Number, minimum: 15, maximum: 120 }, reason: { required: true, type: () => String }, notes: { required: false, type: () => String }, recurrence: { required: true, type: () => require("./recurring.dto").RecurrencePatternDto } };
    }
}
exports.CreateRecurringAppointmentDto = CreateRecurringAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID for all recurring appointments',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRecurringAppointmentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nurse UUID for all recurring appointments',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRecurringAppointmentDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of recurring appointments',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.MEDICATION_ADMINISTRATION,
    }),
    (0, class_validator_1.IsEnum)(create_appointment_dto_1.AppointmentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRecurringAppointmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time for the first appointment in the series',
        example: '2025-10-28T10:30:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateRecurringAppointmentDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Duration of each appointment in minutes',
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
], CreateRecurringAppointmentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the recurring appointments',
        example: 'Daily insulin administration',
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRecurringAppointmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes for all appointments in the series',
        example: 'Check blood sugar before administering',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecurringAppointmentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recurrence pattern configuration',
        type: RecurrencePatternDto,
    }),
    (0, class_transformer_1.Type)(() => RecurrencePatternDto),
    __metadata("design:type", RecurrencePatternDto)
], CreateRecurringAppointmentDto.prototype, "recurrence", void 0);
//# sourceMappingURL=recurring.dto.js.map