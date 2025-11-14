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
exports.UpcomingAppointmentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpcomingAppointmentDto {
    id;
    student;
    studentId;
    time;
    type;
    priority;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, format: "uuid" }, student: { required: true, type: () => String }, studentId: { required: true, type: () => String, format: "uuid" }, time: { required: true, type: () => String }, type: { required: true, type: () => String }, priority: { required: true, type: () => Object, enum: ['high', 'medium', 'low'] } };
    }
}
exports.UpcomingAppointmentDto = UpcomingAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student full name',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "student", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Formatted appointment time',
        example: '2:30 PM',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment type',
        example: 'Routine Checkup',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment priority level',
        enum: ['high', 'medium', 'low'],
        example: 'medium',
    }),
    (0, class_validator_1.IsIn)(['high', 'medium', 'low']),
    __metadata("design:type", String)
], UpcomingAppointmentDto.prototype, "priority", void 0);
//# sourceMappingURL=upcoming-appointment.dto.js.map