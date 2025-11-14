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
exports.RecurringTemplateResponseDto = exports.CreateRecurringTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRecurringTemplateDto {
    studentId;
    appointmentType;
    frequency;
    dayOfWeek;
    timeOfDay;
    startDate;
    endDate;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, appointmentType: { required: true, type: () => String }, frequency: { required: true, type: () => Object }, dayOfWeek: { required: false, type: () => Number }, timeOfDay: { required: true, type: () => String }, startDate: { required: true, type: () => String }, endDate: { required: false, type: () => String }, createdBy: { required: true, type: () => String } };
    }
}
exports.CreateRecurringTemplateDto = CreateRecurringTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of appointment' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
        description: 'Recurrence frequency',
    }),
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'biweekly', 'monthly']),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Day of week (0-6)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRecurringTemplateDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time of day (HH:MM format)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "timeOfDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for recurring series' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for recurring series' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User who created the template' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRecurringTemplateDto.prototype, "createdBy", void 0);
class RecurringTemplateResponseDto {
    id;
    studentId;
    appointmentType;
    frequency;
    dayOfWeek;
    timeOfDay;
    startDate;
    endDate;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, appointmentType: { required: true, type: () => String }, frequency: { required: true, type: () => Object }, dayOfWeek: { required: false, type: () => Number }, timeOfDay: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, createdBy: { required: true, type: () => String } };
    }
}
exports.RecurringTemplateResponseDto = RecurringTemplateResponseDto;
//# sourceMappingURL=recurring-appointments.dto.js.map