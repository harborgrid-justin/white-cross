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
exports.DateRangeDto = exports.BulkCancelDto = exports.SearchAppointmentsDto = exports.StatisticsFiltersDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const update_appointment_dto_1 = require("./update-appointment.dto");
const create_appointment_dto_1 = require("./create-appointment.dto");
class StatisticsFiltersDto {
    nurseId;
    dateFrom;
    dateTo;
    static _OPENAPI_METADATA_FACTORY() {
        return { nurseId: { required: false, type: () => String, format: "uuid" }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date } };
    }
}
exports.StatisticsFiltersDto = StatisticsFiltersDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter statistics by nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StatisticsFiltersDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for statistics period',
        example: '2025-10-01',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], StatisticsFiltersDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for statistics period',
        example: '2025-10-31',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], StatisticsFiltersDto.prototype, "dateTo", void 0);
class SearchAppointmentsDto {
    search;
    nurseId;
    studentId;
    status;
    type;
    dateFrom;
    dateTo;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, nurseId: { required: false, type: () => String, format: "uuid" }, studentId: { required: false, type: () => String, format: "uuid" }, status: { required: false, enum: require("./update-appointment.dto").AppointmentStatus }, type: { required: false, enum: require("./create-appointment.dto").AppointmentType }, dateFrom: { required: false, type: () => Date }, dateTo: { required: false, type: () => Date }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.SearchAppointmentsDto = SearchAppointmentsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query (searches in reason, notes, student name, nurse name)',
        example: 'flu shot',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchAppointmentsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchAppointmentsDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SearchAppointmentsDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by appointment status',
        enum: update_appointment_dto_1.AppointmentStatus,
        example: update_appointment_dto_1.AppointmentStatus.SCHEDULED,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(update_appointment_dto_1.AppointmentStatus),
    __metadata("design:type", String)
], SearchAppointmentsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by appointment type',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_appointment_dto_1.AppointmentType),
    __metadata("design:type", String)
], SearchAppointmentsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for date range filter',
        example: '2025-10-01',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SearchAppointmentsDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for date range filter',
        example: '2025-10-31',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SearchAppointmentsDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        example: 1,
        minimum: 1,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchAppointmentsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 20,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchAppointmentsDto.prototype, "limit", void 0);
class BulkCancelDto {
    appointmentIds;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { appointmentIds: { required: true, type: () => [String] }, reason: { required: false, type: () => String } };
    }
}
exports.BulkCancelDto = BulkCancelDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of appointment UUIDs to cancel',
        example: [
            '123e4567-e89b-12d3-a456-426614174000',
            '987fcdeb-51a2-43d1-b456-426614174001',
        ],
        type: 'array',
        items: { type: 'string', format: 'uuid' },
    }),
    __metadata("design:type", Array)
], BulkCancelDto.prototype, "appointmentIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for bulk cancellation',
        example: 'Nurse unavailable due to emergency',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkCancelDto.prototype, "reason", void 0);
class DateRangeDto {
    dateFrom;
    dateTo;
    nurseId;
    static _OPENAPI_METADATA_FACTORY() {
        return { dateFrom: { required: true, type: () => Date }, dateTo: { required: true, type: () => Date }, nurseId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.DateRangeDto = DateRangeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for range',
        example: '2025-10-01',
        type: 'string',
        format: 'date',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DateRangeDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for range',
        example: '2025-10-31',
        type: 'string',
        format: 'date',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], DateRangeDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by nurse UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DateRangeDto.prototype, "nurseId", void 0);
//# sourceMappingURL=statistics.dto.js.map