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
exports.GetReportQueryDto = exports.GetReportParamDto = exports.AnalyticsGenerateCustomReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const report_format_enum_1 = require("../enums/report-format.enum");
class AnalyticsGenerateCustomReportDto {
    reportName;
    reportType;
    startDate;
    endDate;
    format;
    filters;
    recipients;
    schedule;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportName: { required: true, type: () => String }, reportType: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, format: { required: false, enum: require("../enums/report-format.enum").ReportFormat }, recipients: { required: false, type: () => [String] }, schedule: { required: false, type: () => ({ frequency: { required: false, type: () => Object }, dayOfWeek: { required: false, type: () => Number }, dayOfMonth: { required: false, type: () => Number }, time: { required: false, type: () => String } }) } };
    }
}
exports.AnalyticsGenerateCustomReportDto = AnalyticsGenerateCustomReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsGenerateCustomReportDto.prototype, "reportName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report type',
        enum: [
            'IMMUNIZATION_REPORT',
            'COMPLIANCE_STATUS',
            'STUDENT_HEALTH_SUMMARY',
            'MEDICATION_USAGE',
            'INCIDENT_ANALYSIS',
            'APPOINTMENT_SUMMARY',
            'HEALTH_METRICS',
        ],
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsGenerateCustomReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for report period' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AnalyticsGenerateCustomReportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for report period' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AnalyticsGenerateCustomReportDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Report output format',
        enum: report_format_enum_1.ReportFormat,
        default: report_format_enum_1.ReportFormat.JSON,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(report_format_enum_1.ReportFormat),
    __metadata("design:type", String)
], AnalyticsGenerateCustomReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter criteria for report' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AnalyticsGenerateCustomReportDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Email recipients for report distribution',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AnalyticsGenerateCustomReportDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Schedule configuration for recurring reports',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AnalyticsGenerateCustomReportDto.prototype, "schedule", void 0);
class GetReportParamDto {
    id;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String } };
    }
}
exports.GetReportParamDto = GetReportParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetReportParamDto.prototype, "id", void 0);
class GetReportQueryDto {
    includeData;
    format;
    static _OPENAPI_METADATA_FACTORY() {
        return { includeData: { required: false, type: () => Boolean }, format: { required: false, enum: require("../enums/report-format.enum").ReportFormat } };
    }
}
exports.GetReportQueryDto = GetReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include full report data',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetReportQueryDto.prototype, "includeData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Override output format for retrieval',
        enum: report_format_enum_1.ReportFormat,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(report_format_enum_1.ReportFormat),
    __metadata("design:type", String)
], GetReportQueryDto.prototype, "format", void 0);
//# sourceMappingURL=custom-reports.dto.js.map