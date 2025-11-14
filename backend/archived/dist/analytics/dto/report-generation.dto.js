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
exports.GetReportsFilterDto = exports.DistributeReportDto = exports.ExportReportDto = exports.ScheduleRecurringReportDto = exports.GenerateScreeningReportDto = exports.GenerateHIPAAAuditReportDto = exports.GenerateControlledSubstanceReportDto = exports.GenerateImmunizationReportDto = exports.AnalyticsGenerateReportDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const report_format_enum_1 = require("../enums/report-format.enum");
const report_type_enum_1 = require("../enums/report-type.enum");
class AnalyticsGenerateReportDto {
    schoolId;
    periodStart;
    periodEnd;
    format;
    generatedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, periodStart: { required: true, type: () => Date }, periodEnd: { required: true, type: () => Date }, format: { required: true, enum: require("../enums/report-format.enum").ReportFormat }, generatedBy: { required: true, type: () => String } };
    }
}
exports.AnalyticsGenerateReportDto = AnalyticsGenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsGenerateReportDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period start date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AnalyticsGenerateReportDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Period end date' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AnalyticsGenerateReportDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: report_format_enum_1.ReportFormat, description: 'Report format' }),
    (0, class_validator_1.IsEnum)(report_format_enum_1.ReportFormat),
    __metadata("design:type", String)
], AnalyticsGenerateReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID generating report' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsGenerateReportDto.prototype, "generatedBy", void 0);
class GenerateImmunizationReportDto extends AnalyticsGenerateReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GenerateImmunizationReportDto = GenerateImmunizationReportDto;
class GenerateControlledSubstanceReportDto extends AnalyticsGenerateReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GenerateControlledSubstanceReportDto = GenerateControlledSubstanceReportDto;
class GenerateHIPAAAuditReportDto extends AnalyticsGenerateReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GenerateHIPAAAuditReportDto = GenerateHIPAAAuditReportDto;
class GenerateScreeningReportDto extends AnalyticsGenerateReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.GenerateScreeningReportDto = GenerateScreeningReportDto;
class ScheduleRecurringReportDto {
    reportType;
    frequency;
    format;
    distributionList;
    isActive = true;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: true, enum: require("../enums/report-type.enum").ReportType }, frequency: { required: true, type: () => Object }, format: { required: true, enum: require("../enums/report-format.enum").ReportFormat }, distributionList: { required: true, type: () => [String] }, isActive: { required: true, type: () => Boolean, default: true }, createdBy: { required: true, type: () => String } };
    }
}
exports.ScheduleRecurringReportDto = ScheduleRecurringReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: report_type_enum_1.ReportType, description: 'Report type' }),
    (0, class_validator_1.IsEnum)(report_type_enum_1.ReportType),
    __metadata("design:type", String)
], ScheduleRecurringReportDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'],
        description: 'Frequency',
    }),
    (0, class_validator_1.IsEnum)(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']),
    __metadata("design:type", String)
], ScheduleRecurringReportDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: report_format_enum_1.ReportFormat, description: 'Report format' }),
    (0, class_validator_1.IsEnum)(report_format_enum_1.ReportFormat),
    __metadata("design:type", String)
], ScheduleRecurringReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Email addresses for distribution',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ScheduleRecurringReportDto.prototype, "distributionList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status', default: true }),
    __metadata("design:type", Boolean)
], ScheduleRecurringReportDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID creating schedule' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleRecurringReportDto.prototype, "createdBy", void 0);
class ExportReportDto {
    format;
    static _OPENAPI_METADATA_FACTORY() {
        return { format: { required: true, enum: require("../enums/report-format.enum").ReportFormat } };
    }
}
exports.ExportReportDto = ExportReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: report_format_enum_1.ReportFormat, description: 'Export format' }),
    (0, class_validator_1.IsEnum)(report_format_enum_1.ReportFormat),
    __metadata("design:type", String)
], ExportReportDto.prototype, "format", void 0);
class DistributeReportDto {
    recipients;
    static _OPENAPI_METADATA_FACTORY() {
        return { recipients: { required: true, type: () => [String] } };
    }
}
exports.DistributeReportDto = DistributeReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Recipient email addresses' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DistributeReportDto.prototype, "recipients", void 0);
class GetReportsFilterDto {
    reportType;
    schoolId;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: false, enum: require("../enums/report-type.enum").ReportType }, schoolId: { required: false, type: () => String }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
exports.GetReportsFilterDto = GetReportsFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: report_type_enum_1.ReportType,
        description: 'Filter by report type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(report_type_enum_1.ReportType),
    __metadata("design:type", String)
], GetReportsFilterDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by school ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetReportsFilterDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetReportsFilterDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetReportsFilterDto.prototype, "endDate", void 0);
//# sourceMappingURL=report-generation.dto.js.map