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
exports.GetNoShowRateQueryDto = exports.GetAppointmentTrendsQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GetAppointmentTrendsQueryDto {
    schoolId;
    startDate;
    endDate;
    appointmentType;
    status;
    groupBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, appointmentType: { required: false, type: () => String }, status: { required: false, type: () => String }, groupBy: { required: false, type: () => String } };
    }
}
exports.GetAppointmentTrendsQueryDto = GetAppointmentTrendsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAppointmentTrendsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for appointment trends' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetAppointmentTrendsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for appointment trends' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetAppointmentTrendsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by appointment type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAppointmentTrendsQueryDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by appointment status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAppointmentTrendsQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Group results by time period',
        enum: ['DAY', 'WEEK', 'MONTH'],
        default: 'MONTH',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAppointmentTrendsQueryDto.prototype, "groupBy", void 0);
class GetNoShowRateQueryDto {
    schoolId;
    startDate;
    endDate;
    appointmentType;
    includeReasons;
    compareWithTarget;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, appointmentType: { required: false, type: () => String }, includeReasons: { required: false, type: () => Boolean }, compareWithTarget: { required: false, type: () => Number } };
    }
}
exports.GetNoShowRateQueryDto = GetNoShowRateQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetNoShowRateQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for no-show analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetNoShowRateQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for no-show analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetNoShowRateQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by appointment type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetNoShowRateQueryDto.prototype, "appointmentType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include reasons for no-shows',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetNoShowRateQueryDto.prototype, "includeReasons", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Compare with target no-show rate',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetNoShowRateQueryDto.prototype, "compareWithTarget", void 0);
//# sourceMappingURL=appointment-analytics.dto.js.map