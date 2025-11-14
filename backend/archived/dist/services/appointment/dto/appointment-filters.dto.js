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
exports.AppointmentFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_appointment_dto_1 = require("./create-appointment.dto");
const update_appointment_dto_1 = require("./update-appointment.dto");
class AppointmentFiltersDto {
    nurseId;
    studentId;
    status;
    appointmentType;
    dateFrom;
    dateTo;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { nurseId: { required: false, type: () => String, format: "uuid" }, studentId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("./update-appointment.dto").AppointmentStatus }, appointmentType: { required: false, enum: require("./create-appointment.dto").AppointmentType }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, page: { required: false, type: () => Number, minimum: 1 }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 } };
    }
}
exports.AppointmentFiltersDto = AppointmentFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments by nurse/healthcare provider UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AppointmentFiltersDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments by student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AppointmentFiltersDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments by status',
        enum: update_appointment_dto_1.AppointmentStatus,
        example: update_appointment_dto_1.AppointmentStatus.SCHEDULED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(update_appointment_dto_1.AppointmentStatus),
    __metadata("design:type", String)
], AppointmentFiltersDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments by type',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_appointment_dto_1.AppointmentType),
    __metadata("design:type", String)
], AppointmentFiltersDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments from this date (inclusive)',
        example: '2025-10-01T00:00:00Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AppointmentFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter appointments to this date (inclusive)',
        example: '2025-10-31T23:59:59Z',
        type: 'string',
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AppointmentFiltersDto.prototype, "dateTo", void 0);
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
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AppointmentFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page (1-100)',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AppointmentFiltersDto.prototype, "limit", void 0);
//# sourceMappingURL=appointment-filters.dto.js.map